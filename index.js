var jwt = require("jsonwebtoken");
//let path=require('path')
const bcrypt = require("bcrypt");
const { sendMail } = require("./sendEmailFunction");
const Express = require("express");
const path = __dirname + '/build/';

const { google } = require("googleapis");
const { TokenGenerator, verifier } = require("./Authentication/JWT");
const mongoose = require("mongoose");
const { VideoContent } = require("./Model/ContentPool");
const multer = require("multer");
var cors = require("cors");
const fetch = require("node-fetch");
const theFrontEndProxy = "http://localhost:3000";
const theBackendProxy = "http://localhost:3001";
let uniqid = require("uniqid");
const Readable = require("stream").Readable;
const session = require("express-session");
const { UserModel } = require("./Model/user");
const { Comment } = require("./Model/CommentsPool");
const { Notification } = require("./Model/Notification");
const MulterAnyFunction = multer();
const paypal = require("paypal-rest-sdk");
var drive = google.drive("v3");

const key = require("./gospleKeys.json");
const { content } = require("googleapis/build/src/apis/content");
const cookieParser = require("cookie-parser");
var jwToken = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/drive"],
  null
);
jwToken.authorize((authErr) => {
  if (authErr) {
    console.log("error : " + authErr);
    return;
  } else {
    // console.log("Authorization accorded");
  }
});
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AaoO8dxIn0YjSdACsrKJAFeICbehpxIUQCTA30d8RsnVGTSCIcj6Ke_y8fvn3k4gMTpKpWBgQfw2Uc8U",
  client_secret:
    "EPl6w__obbHj8l_Dy8-cSXAuqFNJkbwHX9qaUM71b-Bwu26brmLZBSUxxNa0e_a-luIX-0phf9Pqs0Th",
});
const app = Express();
const issue2options = {
  origin: true,
  methods: ["GET"],
  credentials: true,
  maxAge: 3600,
};
app.use(
  cors({
    origin: ["http://localhost:3000","http://35.197.50.166:3000", "http://localhost:3000"],
    methods: ["POST", "GET", "PUSH"],
    credentials: true,
  })
);

app.use(Express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard.com",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(cookieParser());
app.use(Express.static(path));

const DB =
  "mongodb+srv://Archived:Gospel@gospelarchived.hih5hr9.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((results) => {
    console.log("connected....");
  })
  .catch((err) => {
    console.warn(err);
  });

function bufferToStream(buffer) {
  var stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream;
}
const checkAuthenticated = (req, res, next) => {
  let token = req.cookies["AuthToken0111"];
  UserModel.findOne({ AuthId: token }).then((user) => {
    if (user == null) {
      res.json({ user: "no user" });
      next();
    } else {
      res.json({ user });
      next();
    }
  });

  next();
};
app.get("/api", checkAuthenticated, (req, res) => {
  //console.log(req.user)
});
app.post("/api/ResetPassword", (req, res) => {
  //console.log(req.body)
  let Email = req.body.Email;
  let randomNumberAuth = Math.floor(Math.random() * 100000);
  UserModel.findOne({ Email: Email }).then((results) => {
    if (results) {
      UserModel.updateOne(
        { Email: Email },
        { resetPin: randomNumberAuth },
        () => {
          let Html = `
        <body>
        <center><Header style="background-color:#17C1E8,margin-top:-1.5%,color:white">
                <h1>Gospel Archived</h1>
            </Header>
             <div>
                <h3>
                    Hi  ${results.userName}
                </h3>
                <h4>
                    your reset code is  ${randomNumberAuth}
                </h4>
                <h6>
                    If you feel suspiciouse of the link provided for login always visit our website <a href="https://gospelarchived.website">https://gospelarchived.website</a>
                </h6>
             </div>
        </center>
        </body>`;
          sendMail(Email, "Reset Pin", Html)
            .then((result) => {
              console.log("Email sent...");
              res.json({ successresetResponce: "Reset Code sent" });
            })
            .catch((error) => console.log(error.message));
        }
      );
    } else {
      res.json({ resetResponce: "no user Found with this email" });
    }
  });
});
app.post("/api/authentication/ActivationCodeDonation", (req, res) => {
  //console.log(req.body)
  let Email = req.body.Email;
  let randomNumberAuth = Math.floor(Math.random() * 100000);
  UserModel.findOne({ Email: Email }).then((results) => {
    if (results) {
      UserModel.updateOne(
        { Email: Email },
        { resetPin: randomNumberAuth },
        () => {
          let Html = `
        <body>
        <center><Header style="background-color:#17C1E8,margin-top:-1.5%,color:white">
                <h1>Gospel Archived</h1>
            </Header>
             <div>
                <h3>
                    Hi  ${results.userName}
                </h3>
                <h4>
                    your Activation code is  ${randomNumberAuth}
                </h4>
                <h6>
                    If you feel suspiciouse of the link provided for login always visit our website <a href="https://gospelarchived.website">https://gospelarchived.website</a>
                </h6>
             </div>
        </center>
        </body>`;
          sendMail(Email, "Reset Pin", Html)
            .then((result) => {
              console.log("Email sent...");
              res.json({ successresetResponce: "Activation Code sent" });
            })
            .catch((error) => console.log(error.message));
        }
      );
    } else {
      res.json({ resetResponce: "no user Found with this email" });
    }
  });
});
app.post("/api/ResetPasswordProceeds", (req, res) => {
  let Pin = req.body.ResetPin;
  let password = req.body.newPassword;
  bcrypt.hash(password, 10).then(function (hash) {
    UserModel.findOne({ resetPin: Pin }).then((results) => {
      if (results) {
        let Html = `
        <body>
        <center><Header style="background-color:#17C1E8,margin-top:-1.5%,color:white">
                <h1>Gospel Archived</h1>
            </Header>
             <div>
                <h3>
                    Hi  ${results.userName}
                </h3>
                <h4>
                    your password was successfully changed ,Keep your password safe
                </h4>
                <h6>
                    If you feel suspiciouse of the link provided for login always visit our website <a href="https://gospelarchived.website">https://gospelarchived.website</a>
                </h6>
             </div>
        </center>
        </body>`;
        sendMail(results.Email, "Reset password success", Html)
          .then((result) => {
            let AuthIdentity = TokenGenerator(hash, results.Email);
            UserModel.updateOne({resetPin:Pin},{resetPin:0},(err)=>{
                   if(err) throw err
            })
            UserModel.updateOne({resetPin:Pin},{AuthId:AuthIdentity},(err)=>{
                   if(err) throw err
            })
            console.log("Email sent...");
            res.json({ successresetResponce: "True reset Pin" });
          })
          .catch((error) => console.error(error.message));
      } else {
        res.json({
          resetResponce: "Wrong reset Code, re-check the Email",
        });
      }
    });
  });
});
app.post('/api/logout',(req,res)=>{
  if(req.body.status == "logging out"){
    res.clearCookie("AuthToken0111")
    res.json({ActivateResponce : 'logout successful'})
  }
})
app.post("/api/CheckActivationCode", (req, res) => {
  let Pin = req.body.TheCode;
  
    UserModel.findOne({ resetPin: Pin }).then((results) => {
      if (results) {
       
        UserModel.updateOne({ resetPin: Pin},{AccountActivated:true},(err)=>{
          if(err) throw err
          UserModel.updateOne({ resetPin: Pin},{resetPin:0000},(err)=>{
            if(err) throw err
          })
        })
        res.json({
          ActivateResponce: "successfull Activated",
        });
      } else {
        res.json({
          ActivateResponce: "Wrong Activation Code, re-check the Email",
        });
      }
    });
  
});
app.post("/api/authentication/SignUp", MulterAnyFunction.any(), (req, res) => {
  let password = req.body.password;
  let saltRounds = 10;

  bcrypt.hash(password, saltRounds).then(function (hash) {
    let name = req.body.name;
    let email = req.body.Email.toLowerCase();
    let phone = req.body.Phone;
    var folderId = "1Xw8Ydiou9iCpS5jybiaqjmT_bR0GaRcm"; //1Xw8Ydiou9iCpS5jybiaqjmT_bR0GaRcm
    var folderName = name;
    var fileMetadataa = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [folderId],
    };

    let AuthIdentity = TokenGenerator(hash, email);
    UserModel.findOne({ Email: email }).then((results) => {
      if (results == null) {
        drive.files.create(
          {
            auth: jwToken,
            resource: fileMetadataa,
            fields: "id",
          },
          function (err, file) {
            new UserModel({
              Email: email,
              AuthId: AuthIdentity,
              Phone: phone,
              userName: name,
              folderId: file.data.id,
            })
              .save()
              .then((results) => {
                res.json({ messageSuccess: "User Registered ,Now Login" });
              });
          }
        );
      } else {
        res.json({ messageFailure: "Email is not available" });
      }
    });
  });

  //console.log(req.body)
});

app.get("/login", (req, res) => {
  //res.json({messageFailure:'the user Already  exist'})
  res.redirect(theFrontEndProxy + "/");
});

app.get("/api/commentPool", (req, res) => {
  Comment.find().then((results) => {
    res.json({ comments: results });
  });
});
app.get("/api/notification", (req, res) => {
  Notification.find().then((notif) => {
    res.json({ notif });
  });
});

app.post("/loginGoogle", (req, res) => {
  console.log(req.body);
});

app.post("/api/authentication/SignIn", (req, res) => {
  const { Email, password } = req.body;
  UserModel.findOne({ Email: Email.toLowerCase() }).then((results) => {
    if (results == null) {
      res.json({ auth: "no user with this Email" });
    }else{
    if ( results.AuthId.length !== 21) {

      const passwordVerify = verifier(results.AuthId, results.Email);
      bcrypt.compare(password, passwordVerify).then(function (result) {
        if (result == true) {
          res.cookie("AuthToken0111", results.AuthId, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });
          res.json({ successAuth: "You are successfuly logged in" });
        } else {
          res.json({ auth: "Wrong password" });
        }
      });
    } else {
      res.json({ auth: "You used google to SignUp Continue   with Google" });
    }}
  });
});
app.post("/api/ToTheDrive", MulterAnyFunction.any(), (req, res) => {
  let user = JSON.parse(req.body.user);
  let DURATION;
  function readableDuration(seconds) {
    sec = Math.floor(seconds);
    min = Math.floor(sec / 60);
    min = min >= 10 ? min : "0" + min;
    sec = Math.floor(sec % 60);
    sec = sec >= 10 ? sec : "0" + sec;
    return min + ":" + sec;
  }

  DURATION = readableDuration(req.body.duration);

  var fileMetadata1 = {
    name: [req.files[1].originalname],
    parents: [user.user.folderId],
  };

  var media = {
    mimeType: [req.files[0].mimetype],
    body: bufferToStream(req.files[0].buffer),
  };

  var fileMetadata = {
    name: [req.files[0].originalname],
    parents: [user.user.folderId],
  };

  var media1 = {
    mimeType: [req.files[1].mimetype],
    body: bufferToStream(req.files[1].buffer),
  };
  drive.files.create(
    {
      auth: jwToken,
      resource: fileMetadata1,
      media: media1,
      fields: "id",
    },
    async function (err, file1) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        drive.files.create(
          {
            auth: jwToken,
            resource: fileMetadata,
            media: media,
            fields: "id",
          },
          async function (err, file) {
            if (err) {
              // Handle error
              console.error(err);
            } else {
              // console.log('finish upload thumbnail and  video');
              new VideoContent({
                userName: user.user.userName,
                ProfilePhotoUrl: user.user.ProfilePhotoUrl,
                ThumbnailId: file.data.id,
                VideoId: file1.data.id,
                Duration: DURATION,
                userId: user.user._id,
                Category: req.body.Category,
                Title: req.body.Title,
              })
                .save()
                .then((response) => {
                  UserModel.updateOne(
                    { userName: user.user.userName },
                    { $addToSet: { PostsIds: response.id } },
                    function () {
                      res.json({uploadStatus : "uploaded"})
                      // console.log('updated the usermodel', response.id)
                    }
                  );
                });
            }
          }
        );
      }
    }
  );
});
app.post("/api/addComment", MulterAnyFunction.any(), (req, res) => {
  new Comment({
    userName: req.body.UserName,
    ProfilePhotoUrl: req.body.userProfile,
    Comment: req.body.comment,
  })
    .save()
    .then((results) => {
      VideoContent.updateOne(
        { ThumbnailId: req.body.VideoId },
        { $addToSet: { CommentsIds: results.id } },
        () => {
          // console.log('')
        }
      );
      VideoContent.findOne({ ThumbnailId: req.body.VideoId }).then((res) => {
        //console.log(res)
        UserModel.updateOne(
          { userName: res.userName },
          { $addToSet: { CommentId: results.id } },
          () => {
            //  console.log('')
          }
        );
      });
    });
});

app.post("/api/coinbase", MulterAnyFunction.any(), (req, res) => {
  UserModel.findById(req.body.IdOfTheSupporter).then((results1) => {
    VideoContent.findOne({ userName: req.body.accountName }).then(
      (results2) => {
        let SuccessUrl =
          theBackendProxy +
          "/api/coinbasecConfirmPayment/" +
          results1._id +
          results2._id +
          req.body.ammount;

        const url = "https://api.commerce.coinbase.com/charges";
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "X-CC-Api-Key": "a2940582-a2ac-41cf-ab13-0db3badabc59",
            "X-CC-Version": "2018-03-22",
          },
          body: JSON.stringify({
            local_price: { amount: req.body.ammount, currency: "USD" },
            metadata: {
              customer_id: results1.id,
              customer_name: results1.userName,
            },
            name: "support",
            description:
              "support for  " +
              "  " +
              results2.userName +
              "  " +
              "through Gosple Archive",
            pricing_type: "fixed_price",
            redirect_url: SuccessUrl,
            cancel_url: theBackendProxy + "/cancel",
          }),
        };

        fetch(url, options)
          .then((res) => res.json())
          .then((responce) => {
            res.redirect(responce.data.hosted_url);
          })
          .catch((err) => console.error("error:" + err));
      }
    );
  });
});
app.post("/api/paypal", MulterAnyFunction.any(), (req, res) => {
  // console.log(req.body)
  UserModel.findById(req.body.IdOfTheSupporter).then((results1) => {
    VideoContent.findOne({ userName: req.body.accountName }).then(
      (results2) => {
        let SuccessUrl =
          theBackendProxy +
          "/api/PaypalConfirmPayment/" +
          results1._id +
          results2._id +
          req.body.ammount;
        const create_payment_json = {
          intent: "sale",
          payer: {
            payment_method: "paypal",
          },
          redirect_urls: {
            return_url: SuccessUrl,
            cancel_url: theBackendProxy + "/cancel",
          },
          transactions: [
            {
              item_list: {
                items: [
                  {
                    name: "support",
                    sku: "001",
                    price: req.body.ammount,
                    currency: "USD",
                    quantity: 1,
                  },
                ],
              },
              amount: {
                currency: "USD",
                total: req.body.ammount,
              },
              description: "support for " + "" + results2.userName,
            },
          ],
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
            throw error;
          } else {
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === "approval_url") {
                res.redirect(payment.links[i].href);
              }
            }
          }
        });
      }
    );
  });
});
app.get("/api/coinbasecConfirmPayment/:id", (req, res) => {
  let theId = req.params.id;
  let idForSupporter = theId.slice(0, 24);
  let idForReaciver = theId.slice(24, 48);
  let ammount = theId.slice(48);
  //console.log(idForSupporter,idForReaciver,ammount)
  UserModel.findById(idForSupporter).then((supporter) => {
    VideoContent.findById(idForReaciver).then((Reaciver) => {
      let newSupport = supporter.supportAmmount + ammount;
      let supporterBody =
        "You have supported" +
        " " +
        Reaciver.userName +
        "with" +
        "" +
        ammount +
        "$" +
        "" +
        "thank you very much. if you need their contacts mail them throught" +
        "" +
        Reaciver.Email;
      let ReaciverBody =
        "You have reacived support from" +
        " " +
        supporter.userName +
        " " +
        "of ammount" +
        " " +
        ammount +
        "$" +
        " " +
        "please contact and thank them throught this email" +
        "" +
        supporter.Email +
        "";
      new Notification({
        userName: Reaciver.userName,
        ProfilePhotoUrl: Reaciver.ProfilePhotoUrl,
        Notification: supporterBody,
      })
        .save()
        .then((supporter) => {
          UserModel.updateOne(
            { userName: supporter.userName },
            { $addToSet: { notifications: supporter.id } },
            () => {
              // console.log('notifiation pushed')
            }
          );
        });
      new Notification({
        userName: supporter.userName,
        ProfilePhotoUrl: supporter.ProfilePhotoUrl,
        Notification: ReaciverBody,
      })
        .save()
        .then((reaciver) => {
          UserModel.updateOne(
            { userName: reaciver.userName },
            { $addToSet: { notifications: reaciver.id } },
            () => {
              // console.log('notifiation2 pushed')
            }
          );
          UserModel.updateOne(
            { userName: reaciver.userName },
            { supportAmmount: newSupport },
            () => {
              // console.log('new support added')
              res.redirect(theFrontEndProxy + "/");
            }
          );
        });
    });
  });
});
app.get("/api/PaypalConfirmPayment/:id", (req, res) => {
  let theId = req.params.id;
  let idForSupporter = theId.slice(0, 24);
  let idForReaciver = theId.slice(24, 48);
  let ammount = theId.slice(48);
  let actualAmmount = ammount - parseInt(ammount) * 0.15;
  // console.log(actualAmmount)
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: ammount,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        //  console.log('finnished to payment')
      }
    }
  );
  UserModel.findById(idForSupporter).then((supporter) => {
    VideoContent.findById(idForReaciver).then((Reaciver) => {
      let newSupport = supporter.supportAmmount + actualAmmount;
      let supporterBody =
        "You have supported" +
        " " +
        Reaciver.userName +
        "with" +
        "" +
        ammount +
        "$" +
        "" +
        "thank you very much. if you need their contacts mail them throught" +
        "" +
        Reaciver.Email;
      let ReaciverBody =
        "You have reacived support from" +
        " " +
        supporter.userName +
        " " +
        "of ammount" +
        " " +
        ammount +
        "$" +
        " " +
        "please contact and thank them throught this email" +
        "" +
        supporter.Email +
        "";
      new Notification({
        userName: Reaciver.userName,
        ProfilePhotoUrl: Reaciver.ProfilePhotoUrl,
        Notification: supporterBody,
      })
        .save()
        .then((supporter) => {
          UserModel.updateOne(
            { userName: supporter.userName },
            { $addToSet: { notifications: supporter.id } },
            () => {
              // console.log('notifiation pushed')
            }
          );
        });
      new Notification({
        userName: supporter.userName,
        ProfilePhotoUrl: supporter.ProfilePhotoUrl,
        Notification: ReaciverBody,
      })
        .save()
        .then((reaciver) => {
          UserModel.updateOne(
            { userName: reaciver.userName },
            { $addToSet: { notifications: reaciver.id } },
            () => {
              //  console.log('notifiation2 pushed')
            }
          );
          UserModel.updateOne(
            { userName: reaciver.userName },
            { supportAmmount: newSupport },
            () => {
              //  console.log('new support added')
              res.redirect(theFrontEndProxy + "/");
            }
          );
        });
    });
  });
});
app.post("/api/search", MulterAnyFunction.any(), async (req, res) => {
  let searchRes = await VideoContent.find({
    Title: { $regex: new RegExp("^" + req.body.payload + ".*", "i") },
  }).exec();
  res.json(searchRes.slice(0, 10));
});
app.post("/api/addLike", MulterAnyFunction.any(), (req, res) => {
  //ikosa
  UserModel.findOne({ folderId: req.body.FolderId }).then((results) => {
    let newLikes = results.likes + 1;
    VideoContent.updateOne(
      { ThumbnailId: req.body.videoId },
      { $addToSet: { Likes: req.body.user } },
      () => {
        UserModel.updateOne(
          { userName: results.userName },
          { likes: newLikes },
          () => {
            // console.log('likes updated')
          }
        );
      }
    );
  });
});
app.post("/api/addViews", MulterAnyFunction.any(), (req, res) => {
  VideoContent.findOne({ ThumbnailId: req.body.videoId }).then((results2) => {
    UserModel.findById(results2.userId).then((results) => {
      let newLikesVideo = results2.Views + 1;
      let newLikesUserModel = results.views + 1;
      VideoContent.updateOne(
        { ThumbnailId: req.body.videoId },
        { Views: newLikesVideo },
        () => {
          UserModel.updateOne(
            { folderId: results.folderId },
            { views: newLikesUserModel },
            () => {
              //  console.log('views updated')
            }
          );
        }
      );
    });
  });
});
app.post("/api/addHistory", MulterAnyFunction.any(), (req, res) => {
  UserModel.findByIdAndUpdate(
    req.body.user,
    { $addToSet: { History: req.body.videoId } },
    (err) => {
      if (err) throw err;
    }
  );
});
app.post("/api/ChangeProfileInfo", MulterAnyFunction.any(), (req, res) => {
  var fileMetadata = {
    name: [req.files[0].originalname],
    parents: [req.body.userId],
  };
  var media = {
    mimeType: [req.files[0].mimetype],
    body: bufferToStream(req.files[0].buffer),
  };
  drive.files.create(
    {
      auth: jwToken,
      resource: fileMetadata,
      media: media,
      fields: "id",
    },
    async function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        let theNewUrl =
          "https://drive.google.com/uc?export=download&id=" + file.data.id;
        UserModel.updateOne(
          { folderId: req.body.userId },
          {
            ProfilePhotoUrl: theNewUrl,
            Email: req.body.ChangeEmail,
            userName: req.body.ChangeName,
            phoneNumber: req.body.ChangePhone,
          },
          () => {
            // console.log('updated')
          }
        );
      }
    }
  );
  //console.log(req.body,req.files[0])
});
app.post("/api/ChangePrivacy", MulterAnyFunction.any(), (req, res) => {
  VideoContent.updateOne(
    { ThumbnailId: req.body.thumbnailId },
    { private: req.body.booleanGiven },
    function () {
      // console.log('private changed')
    }
  );
});
app.post("/api/ManupulateDownloads", MulterAnyFunction.any(), (req, res) => {
  VideoContent.updateOne(
    { ThumbnailId: req.body.thumbnailId },
    { showDownloadButton: req.body.booleanGiven },
    function () {
      // console.log('download Changed changed')
    }
  );
});
app.post("/api/changeCommency", MulterAnyFunction.any(), (req, res) => {
  VideoContent.updateOne(
    { ThumbnailId: req.body.thumbnailId },
    { allowCommenting: req.body.booleanGiven },
    function () {
      // console.log('Commenting changed')
    }
  );
});
app.post("/api/DeleteVideo", MulterAnyFunction.any(), (req, res) => {
  VideoContent.deleteOne({ ThumbnailId: req.body.thumbnailId }, (err) => {
    if (err) throw err;
    // console.log('video with ID: '+req.body.thumbnailId+' is   deleted')
  });
  drive.files.delete({
    auth: jwToken,
    fileId: req.body.thumbnailId,
  });
  drive.files.delete({
    auth: jwToken,
    fileId: req.body.videoId,
  });
});
app.post(
  "/api/supportButtonManupulation",
  MulterAnyFunction.any(),
  (req, res) => {
    //console.log('the request us made')
  }
);
app.post("/api/paypalPayout", MulterAnyFunction.any(), (req, res) => {
  fetch("https://api-m.sandbox.paypal.com/v1/payments/payouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        btoa(
          "AaoO8dxIn0YjSdACsrKJAFeICbehpxIUQCTA30d8RsnVGTSCIcj6Ke_y8fvn3k4gMTpKpWBgQfw2Uc8U:EPl6w__obbHj8l_Dy8-cSXAuqFNJkbwHX9qaUM71b-Bwu26brmLZBSUxxNa0e_a-luIX-0phf9Pqs0Th"
        ),
    },
    // body: '{\n  "sender_batch_header": {\n    "sender_batch_id": "Payouts_2018_100007",\n    "email_subject": "You have a payout!",\n    "email_message": "You have received a payout! Thanks for using our service!"\n  },\n  "items": [\n    {\n      "recipient_type": "EMAIL",\n      "amount": {\n        "value": "9.87",\n        "currency": "USD"\n      },\n      "note": "Thanks for your patronage!",\n      "sender_item_id": "201403140001",\n      "receiver": "receiver@example.com",\n      "alternate_notification_method": {\n        "phone": {\n          "country_code": "91",\n          "national_number": "9999988888"\n        }\n      },\n      "notification_language": "fr-FR"\n    },\n    {\n      "recipient_type": "PHONE",\n      "amount": {\n        "value": "112.34",\n        "currency": "USD"\n      },\n      "note": "Thanks for your support!",\n      "sender_item_id": "201403140002",\n      "receiver": "91-734-234-1234"\n    },\n    {\n      "recipient_type": "PAYPAL_ID",\n      "amount": {\n        "value": "5.32",\n        "currency": "USD"\n      },\n      "note": "Thanks for your patronage!",\n      "sender_item_id": "201403140003",\n      "receiver": "G83JXTJ5EHCQ2"\n    }\n  ]\n}',
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: uniqid(),
        email_subject: "You have a payout!",
        email_message:
          "You have received a payout! Thanks for using our service!",
      },
      items: [
        {
          recipient_type: "PHONE",
          amount: {
            value: "112.34",
            currency: "USD",
          },
          note: "Thanks for your support!",
          sender_item_id: "201403140002",
          receiver: req.body.emailPaypal,
        },
      ],
    }),
  })
    .then((res) => res.json())
    .then((responce) => {
      /*console.log(responce)*/
    })
    .catch((err) => console.error("error:" + err));
});
app.post(
  "/api/ChangeshowAccountPerfomance",
  MulterAnyFunction.any(),
  (req, res) => {
    if (req.body.showAccountPerfomance == "true") {
      UserModel.findByIdAndUpdate(
        req.body.userID,
        { showAccountPerfomance: true },
        (err) => {
          if (err) {
            console.error(err);
          }
          //console.log('updated')
        }
      );
    } else {
      UserModel.findByIdAndUpdate(
        req.body.userID,
        { showAccountPerfomance: false },
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    }

    //console.log(req.body.showAccountPerfomance)
  }
);
app.post("/api/NewThumbnail", MulterAnyFunction.any(), (req, res) => {
  drive.files.delete({
    auth: jwToken,
    fileId: req.body.thumbnailId,
  });
  var fileMetadata = {
    name: [req.files[0].originalname],
    parents: [req.body.folderId],
  };
  var media = {
    mimeType: [req.files[0].mimetype],
    body: bufferToStream(req.files[0].buffer),
  };
  drive.files.create(
    {
      auth: jwToken,
      resource: fileMetadata,
      media: media,
      fields: "id",
    },
    async function (err, file) {
      if (err) throw err;
      VideoContent.updateOne(
        { VideoId: req.body.thumbnailId },
        { VideoId: file.data.id },
        (err) => {
          if (err) throw err;
        }
      );
    }
  );
});
app.post(
  "/api/ChangeshowSupportButton",
  MulterAnyFunction.any(),
  (req, res) => {
    if (req.body.showSupportButton == "true") {
      UserModel.findByIdAndUpdate(
        req.body.userID,
        { showSupportButton: true },
        (err) => {
          if (err) {
            console.error(err);
          } //console.log('updated')
        }
      );
    } else {
      UserModel.findByIdAndUpdate(
        req.body.userID,
        { showSupportButton: false },
        (err) => {
          if (err) {
            console.error(err);
          } // console.log('updated')
        }
      );
    }
  }
);

app.get("/api/Content/:page", (req, res) => {
  const resultsPerPage = 6;
  let page = req.params.page >= 1 ? req.params.page : 1;
  page = page - 1;
  VideoContent.find()
    .sort({ Title: "asc" })
    .limit(resultsPerPage)
    .skip(resultsPerPage * page)
    .then((results) => {
      if (results.length !== 0) {
        res.json(results);
      } else {
        VideoContent.find()
          .sort({ Title: "asc" })
          .limit(resultsPerPage)
          .then((resulta) => {
            res.json(resulta);
          });
      }
    });
});
app.get("/api/Content", (req, res) => {
  VideoContent.find().then((results) => {
    res.json(results);
  });
});
app.get("/api/Content/Songs", (req, res) => {
  VideoContent.find({ Category: "Songs" }).then((results) => {
    res.json(results);
  });
});
app.get("/api/Content/Songs/:page", (req, res) => {
  const resultsPerPage = 6;
  let page = req.params.page >= 1 ? req.params.page : 1;
  page = page - 1;
  VideoContent.find({ Category: "Songs" })
    .sort({ Title: "asc" })
    .limit(resultsPerPage)
    .skip(resultsPerPage * page)
    .then((results) => {
      if (results.length !== 0) {
        res.json(results);
      } else {
        VideoContent.find({ Category: "Songs" })
          .sort({ Title: "asc" })
          .limit(resultsPerPage)
          .then((resulta) => {
            res.json(resulta);
          });
      }
    });
});
app.get("/api/Content/Sermons", (req, res) => {
  VideoContent.find({ Category: "Sermons" }).then((results) => {
    res.json(results);
  });
});
app.get("/api/Content/Sermons/:page", (req, res) => {
  const resultsPerPage = 6;
  let page = req.params.page >= 1 ? req.params.page : 1;
  page = page - 1;
  VideoContent.find({ Category: "Sermons" })
    .sort({ Title: "asc" })
    .limit(resultsPerPage)
    .skip(resultsPerPage * page)
    .then((results) => {
      if (results.length !== 0) {
        res.json(results);
      } else {
        VideoContent.find({ Category: "Sermons" })
          .sort({ Title: "asc" })
          .limit(resultsPerPage)
          .then((resulta) => {
            res.json(resulta);
          });
      }
    });
});
app.get("/api/Content/testmonies", (req, res) => {
  VideoContent.find({ Category: "Testmony" }).then((results) => {
    res.json(results);
  });
});
app.get("/api/Content/testmonies/:page", (req, res) => {
  const resultsPerPage = 6;
  let page = req.params.page >= 1 ? req.params.page : 1;
  page = page - 1;
  VideoContent.find({ Category: "Testmony" })
    .sort({ Title: "asc" })
    .limit(resultsPerPage)
    .skip(resultsPerPage * page)
    .then((results) => {
      if (results.length !== 0) {
        res.json(results);
      } else {
        VideoContent.find({ Category: "Testmony" })
          .sort({ Title: "asc" })
          .limit(resultsPerPage)
          .then((resulta) => {
            res.json(resulta);
          });
      }
    });
});
app.get("/api/Content/mostViews/:page", (req, res) => {
  const resultsPerPage = 6;
  let page = req.params.page >= 1 ? req.params.page : 1;
  page = page - 1;
  VideoContent.find({ Category: "Testmony" })
    .sort({ Views: -1 })
    .limit(resultsPerPage)
    .skip(resultsPerPage * page)
    .then((results) => {
      if (results.length !== 0) {
        res.json(results);
      } else {
        VideoContent.find({ Category: "Testmony" })
          .sort({ Views: -1 })
          .limit(resultsPerPage)
          .then((resulta) => {
            res.json(resulta);
          });
      }
    });
});
app.get('*',(req,res)=>{
  //res.sendFile(path.join(__dirname, "build", 'index.html'))
  res.sendFile(path);

})

let port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("heard from 3001");
});
