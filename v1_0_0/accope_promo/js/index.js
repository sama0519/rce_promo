
var env = "sit"
var hostname, clientid, clietnsecret, basicauth

//loading page setup
$(document).ready(function () {
  $("#creditcardForm")[0].reset()
  $("#loadingbay").hide();
  $("#formpage").hide();
  $("#resultpage").hide();
  $("#errorDetails").hide()
  $("#bankpage").show();
  //get config
  $.ajax({
    url: 'data/config.json',
    type: 'GET',
    success: function(data, textStatus, jqXHR){
      // console.log("getting data"+JSON.stringify(jqXHR))
      var mydata = jqXHR.responseText
      console.log("got remote config:"+mydata)
      mydata = JSON.parse(mydata)
      //slice needed data:
      var mydata = $.grep(mydata, function(e){
        return e.env == env;
      });
      console.log("sliced config:"+JSON.stringify(mydata))
      hostname = mydata[0].hostname
      clientid = mydata[0].clientid
      clientsecret = mydata[0].clientsecret
      basicauth = mydata[0].basicauth
    },
    error: function(xhr, textStatus, errorThrown){
      console.log("error getting data"+JSON.stringify(xhr))
      // var mydata = xhr.responseText
      // console.log("got remote config:"+mydata)
      // mydata = JSON.parse(mydata)
      // hostname = mydata[0].hostname
      // clientid = mydata[0].clientid
      // clientsecret = mydata[0].clientsecret
      // basicauth = mydata[0].basicauth
    }
  })

  $.ajax({
    url: 'data/entry.json',
    type: 'GET',

    success: function(data, textStatus, jqXHR){
      // console.log("getting data"+JSON.stringify(jqXHR))
      var mydata = jqXHR.responseText
      console.log("got remote config:"+mydata)

      mydata = JSON.parse(mydata)
      $("#cardname").text(mydata[0].details[0].name)
      $("#cardimg").text(mydata[0].details[1].name)
      $("#detail1").text(mydata[0].details[2].name)
      $("#detail11").text(mydata[0].details[3].name)
      $("#detail2").text(mydata[0].details[4].name)
      $("#detail21").text(mydata[0].details[5].name)
      $("#detail3").text(mydata[0].details[6].name)
      $("#detail31").text(mydata[0].details[7].name)
      $("#detail4").text(mydata[0].details[8].name)
      $("#detail41").text(mydata[0].details[9].name)
      $("#title1").text(mydata[0].details[10].name)
      $("#title11").text(mydata[0].details[11].name)
      $("#title12").text(mydata[0].details[12].name)
      $("#title13").text(mydata[0].details[13].name)
      $("#title14").text(mydata[0].details[14].name)
      // $("#title15").text(mydata[0].details[15].name)
      $("#title16").text(mydata[0].details[16].name)
      $("#thankyou").text(mydata[0].details[17].name)
    },
    error: function(xhr, textStatus, errorThrown){
      console.log("error getting data"+JSON.stringify(xhr))

    }
  })

})


var addProspect = function () {
  $("#prospectid").text("");
  $("#prospecterror").text("");
  $("#myModal").modal();

  $.ajax({
    url: hostname + "/gcb/api/clientCredentials/oauth2/token/sg/gcb",
    type: "POST",
    headers: {
      "Authorization": basicauth,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: "grant_type=client_credentials&scope=/api",

    success: function (data, textStatus, jqXHR) {
      $("#progressbar").show();

      console.log(JSON.stringify(data, undefined, 2));
      var token = "Bearer " + data.access_token;
      console.log("got new token: " + token);

      var sourceCode  = $("#staffcode").val();
      console.log("my staffcode: " + sourceCode);

      var sel = $("#title").val();
      var firstname = $("#givenName").val();
      var lastname = $("#surname").val();
      var embossName = firstname + " " + lastname;
      var email = $("#email").val();
      var nric = $("#nricinput").val();
      nric = nric.toUpperCase();
      // nric = nric.toUpperCase();
      var phone = $("#phoneinput").val();
      var checkb = $("#tCChkBox").val();

      console.log("my sel: " + sel);
      console.log("my firstname: " + firstname);
      console.log("my lastname: " + lastname);
      console.log("my email: " + email);
      console.log("my phone: " + phone);
      console.log("my NRIC: " + nric);
      console.log("my checkbox: " + checkb);

      //consolidate request
      var request = {
        "product": {

          "creditCardProduct": {
            "sourceCode": sourceCode,
            "cardDeliveryAddress": "HOME_ADDRESS",
            "productCode": "VC830",
            "giftCode": "gc123",
            "organization": "888",
            "logo": "830",
            "embossName": embossName,
            "creditLimitIncreaseIndicator": true,
            "requestCreditShield": false,
            "billingAddress": "HOME_ADDRESS",
            "pinDeliveryAddress": "HOME_ADDRESS"
          }
        },
        "auditDetails": {
          "userIpAddress": "123.23.111.23"
        },
        "applicant": {

          "phone": [{
            "phoneType": "MOBILE_PHONE_NUMBER",
            "areaCode": "",
            "extension": "",
            "phoneNumber": phone,
            "phoneCountryCode": "65",
            "okToCall": true,
            "okToSms": true
          }],
          "contactConsent": {
            "okToCall": false,
            "okToMail": true,
            "okToSms": true
          },
          "name": {
            "aliasName": "",
            "surname": lastname,
            "givenName": firstname,
            "localEnglishGivenName": firstname,
            "localEnglishSurname": lastname,
            "middleName": "",
            "saluteBy": "",
            "salutation": sel,
            "suffix": ""
          },

          "email": [{
            "emailAddress": email,
            "okToEmail": true,
            "isPrerferredEmailAddress": true
          }]

        }
      }

      console.log(JSON.stringify(request, undefined, 2));

      $.ajax({
        url: hostname + "/gcb/api/v1/apac/onboarding/prospects",
        type: "POST",
        headers: {
          "Authorization": token,
          "Content-Type": 'application/json',
          "client_id": clientid,
          "uuid": '123456',
          "Accept": 'application/json',
        },
        data: JSON.stringify(request),
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {

        $("#progressbar").hide();
        $("#loadingbay").hide();
        $("#submitname").show();

          $("#formpage").hide();
          var temp_surname = $("#surname").val()
          var temp_givenName = $("#givenName").val();
          var finalname = temp_givenName + " " + temp_surname;
          $("#pageTitleName").text(finalname)
          $("#resultpage").show();

          console.log(JSON.stringify(data, undefined, 2));
        },
        error: function (xhr, textStatus, errorThrown) {
          //                    $("#myModal").model("hide");
          $("#submitname").show();
          $("#loadingbay").hide();

          $("#progressbar").hide();
          $("#prospecterror").text(JSON.stringify(xhr, undefined, 2));
          //            alert(textStatus);
          //            alert(errorThrown);
        }
      });
    },
    error: function (xhr, textStatus, errorThrown) {
      $("#progressbar").hide();
      $("#submitname").show();
      $("#loadingbay").hide();

      console.log("error message:" + errorThrown)

      alert(JSON.stringify(xhr));
    }
  });
};

var resultForm = function () {
  clearForm();
  $("#loadingbay").hide();
  $("#formpage").show();
  $("#bankpage").hide();
  $("#resultpage").hide();
  $("#title-div").show();$("#title-wrapper-text").text("Title");
}



var goFormPage = function() {

  // clearForm()
  $("#title-div").hide();
  $("#givenName-div").hide();
  $("#surname-div").hide();
  $("#nricinput-div").hide();
  $("#phoneinput-div").hide();
  $("#email-div").hide();


  $("#creditcardForm")[0].reset()
  $("#title-wrapper-text").text("Title");
  $("#resultpage").hide();
  $("#bankpage").hide();
  $("#formpage").show();
}

var goBankPage = function() {
  $("#formpage").hide();
  $("#staffcode").val("");
  $("#resultpage").hide();
  $("#staffForm")[0].reset()
  $("#bankpage").show();
}

var clearForm = function () {
  $("#title").val("")
  $("#givenName").val("");
  $("#surname").val("");
  $("#email").val("");
  $("#phoneinput").val("");
  $("#nricinput").val("");
  $("#checkbox-1").prop('checked', false);
}



$(document).on('change', '#title', function (e) {
    var val = $(e.target).val();
    var text = $(e.target).find("option:selected").text(); //only time the find is required
    var name = $(e.target).attr('name');
    console.log("text"+text);

    if(text=="Title"){
      $("#title-div").show();$("#title-wrapper-text").text("Title");
      $("#title-div").hide();
    }
    else{
      if(text.length >0){
        $("#title-div").show();$("#title-wrapper-text").text(text);
      }else{
        $("#title-div").hide();
      }
    }
});

function isNRICValid(pNric)
{
  var nric = pNric.toUpperCase();
  var lastCharacterOfNRIC = nric.charAt(8);

  var lengthOfNRIC = nric.length;
  var weightfNRIC = 2 * nric.charAt(1) + 7 * nric.charAt(2) + 6 * nric.charAt(3) + 5 * nric.charAt(4) + 4 * nric.charAt(5) + 3 * nric.charAt(6) + 2 * nric.charAt(7);

  var result = (weightfNRIC/11);
  var integerPart = Math.floor(result);
  var remainder = weightfNRIC - (integerPart * 11);
  var checkDigit = 11 - remainder;


  var validCheckDigitValues =
  [
      [1,"A"],
      [2,"B"],
      [3,"C"],
      [4,"D"],
      [5,"E"],
      [6,"F`"],
      [7,"G"],
      [8,"H"],
      [9,"I"],
      [10,"Z"],
      [11,"J"],

  ];

  var ischeckDigitValid = 'false';

  for( var i = 0, len = validCheckDigitValues.length; i < len; i++ )
  {
    if( validCheckDigitValues[i][0] === checkDigit )
    {
        if(lastCharacterOfNRIC == validCheckDigitValues[i][1])
            ischeckDigitValid = true;
        else
            ischeckDigitValid = false;
        break;
    }
  }

  return ischeckDigitValid;

}

$(document).on("keyup", "#nricinput", function(){
  var myvalue = $("#nricinput").val()
  if(myvalue.length==9){
    $("#nricinput").val(myvalue.toUpperCase())
    if(isNRICValid(myvalue)){
      console.log('valid nric')
      $(this)[0].setCustomValidity('');
    }else{
      console.log('invalid nric')
      $(this)[0].setCustomValidity('Please input valid NRIC number');
    }
  }
})

//
$(document).on("keydown", "#email", function(){
    $(this)[0].setCustomValidity('');
})

$(document).ready(function(){
  $("#card_features").on("hide.bs.collapse", function(){
    $("#a_card_features").html('Show Details <span class="glyphicon glyphicon-chevron-right"></span>');
  });
  $("#card_features").on("show.bs.collapse", function(){
    $("#a_card_features").html('Show Details <span class="glyphicon glyphicon-chevron-down"></span>');
  });
});


$(document).on("keyup", "#title", function(){
  if($(this).val().length > 0)
    $("#title-div").show();
  else
    $("#title-div").hide();
});

$(document).on("keyup", "#givenName", function(){
  if($(this).val().length > 0)
    $("#givenName-div").show();
  else
    $("#givenName-div").hide();
});

$(document).on("keyup", "#surname", function(){
  if($(this).val().length > 0)
    $("#surname-div").show();
  else
    $("#surname-div").hide();
});

$(document).on("keyup", "#nricinput", function(){
  if($(this).val().length > 0)
    $("#nricinput-div").show();
  else
    $("#nricinput-div").hide();
});

$(document).on("keyup", "#phoneinput", function(){
  if($(this).val().length > 0)
    $("#phoneinput-div").show();
  else
    $("#phoneinput-div").hide();
});

$(document).on("keyup", "#email", function(){
  if($(this).val().length > 0)
    $("#email-div").show();
  else
    $("#email-div").hide();
});

$(document).on("submit", "#creditcardForm", function(e){
    if (e.isDefaultPrevented()) {
      // handle the invalid form...
      console.log("form is invalid")
    } else {
      // everything looks good!
      e.preventDefault()
      $("#submitname").hide();
      $("#loadingbay").show();
      console.log("all good to go")
      addProspect();
    }
})
$(document).on("submit", "#staffForm", function(e){
    if (e.isDefaultPrevented()) {
      console.log("form is invalid")
    } else {
      e.preventDefault()
      console.log("all good to go")
      goFormPage()
    }
})
