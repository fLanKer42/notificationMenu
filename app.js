app.post("/notifs", (req,res) => {
  if (req.isAuthenticated()) {
    let dateNow = new Date();
    Notif.findOneAndUpdate({user: req.user.username}, {lastPostTime : dateNow, preferredGroup: req.body.preferredGroup, preferredSubGroup: req.body.preferredSubGroup}, {upsert: true},(err,dat) => {
      if (err) {
        console.log(err);
        res.status(err.status||500);
      }
    });
  }
});




app.get("/notifs", (req,res) => {
  if (req.isAuthenticated()) {
    Notif.find({user: req.user.username}, (err,data) => {
      let dateNow = new Date();
      if(err) {
        console.log(err);
        res.status(500);
      }
      else {
        if (data.length == 0) {
          let newNot = new Notif({user: req.user.username, lastPostTime: dateNow, preferredGroup: "any", preferredSubGroup: ["any"]});
          newNot.save((err) => {
            if (err) {
              console.log(err);
              res.status(500);
            }
          });
          res.json({
            "any" : 1,
            "covid19": 0,
            "ndc": 0,
            "unemployment": 0 
          })
        }
        else {
          dateNow = data[0].lastPostTime;
          if (data[0].preferredGroup == "any") {
            let ret = {
              "any": 1,
              "covid19": 0,
              "ndc": 0,
              "unemployment": 0 
            }
            PostHelp.find({time: {$gt: dateNow}}, (err,dat) => {
              if (err) {
                console.log(err);
                res.status(err.status||500);
              }
              else {
                if(dat.length > 4) {
                  ret.covid19 = dat.length;
                }
              }
            });
            PostHelpndc.find({time: {$gt: dateNow}}, (err,dat) => {
              if (err) {
                console.log(err);
                res.status(err.status||500);
              }
              else {
                if(dat.length > 4) {
                  ret.ndc = dat.length;
                }
              }
            });
            PostHelpue.find({time: {$gt: dateNow}}, (err,dat) => {
              if (err) {
                console.log(err);
                res.status(err.status||500);
              }
              else {
                if(dat.length > 4) {
                  ret.unemployment = dat.length;
                }
              }
            });
            res.json(ret);
          }
          else {
            if (data[0].preferredSubGroup[0] == 'any') {
              let ret = {
                "any": 1,
                "covid19": 0,
                "ndc": 0,
                "unemployment": 0 
              }
              if (data[0].preferredGroup == 'covid19') {
                PostHelp.find({time: {$gt: dateNow}}, (err,dat) => {
                  if (err) {
                    console.log(err);
                    res.status(err.status||500);
                  }
                  else {
                    if(dat.length > 4) {
                      ret.covid19 = dat.length;
                    }
                  }
                });
              }
              if (data[0].preferredGroup == 'employment') {
                PostHelpue.find({time: {$gt: dateNow}}, (err,dat) => {
                  if (err) {
                    console.log(err);
                    res.status(err.status||500);
                  }
                  else {
                    if(dat.length > 4) {
                      ret.unemployment = dat.length;
                    }
                  }
                });
              }
              if (data[0].preferredGroup == 'ndc') {
                PostHelpndc.find({time: {$gt: dateNow}}, (err,dat) => {
                  if (err) {
                    console.log(err);
                    res.status(err.status||500);
                  }
                  else {
                    if(dat.length > 4) {
                      ret.ndc = dat.length;
                    }
                  }
                });
              }
            }
            else {
              let ret = {
                "any": 0,
                "covid19": 0,
                "ndc": 0,
                "unemployment": 0 
              }
              PostHelp.find({time : {$gt: dateNow}, requirement: {$in : data[0].preferredSubGroup}}, (err,dat) => {
                if (err) {
                  console.log(err);
                  res.status(err.status||500);
                }
                else {
                  if (dat.length > 4) {
                    ret.covid19 = dat.length;
                  }
                }
              });
              PostHelpndc.find({time : {$gt: dateNow}, requirement: {$in : data[0].preferredSubGroup}}, (err,dat) => {
                if (err) {
                  console.log(err);
                  res.status(err.status||500);
                }
                else {
                  if (dat.length > 4) {
                    ret.ndc = dat.length;
                  }
                }
              });
              PostHelpue.find({time : {$gt: dateNow}, requirement: {$in : data[0].preferredSubGroup}}, (err,dat) => {
                if (err) {
                  console.log(err);
                  res.status(err.status||500);
                }
                else {
                  if (dat.length > 4) {
                    ret.unemployment = dat.length;
                  }
                }
              });
              res.json(ret);
            }
          }
          Notif.findOneAndUpdate({user: req.user.username}, {lastPostTime: new Date()}, (err,data) => {
            if(err) {
              res.status(err.status||500);
              console.log(err);
            }
          });
        }
      }
    });
  }

  else {
    //for testing
    res.json({
      "any": 0,
      "covid19": 4,
      "ndc": 4,
      "unemployment": 4 
    });
    res.end();
  }
});