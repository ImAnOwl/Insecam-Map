
      var loginForm = document.getElementById('login-form');
      var tfLoginForm = document.getElementById('tf-login-form');
      var duoLoginForm = document.getElementById('duo-login-form');
      var userInput = document.getElementById('username');
      var otpUserInput = document.getElementById('otp-code');
      var yubicoUserInput = document.getElementById('yubico-code');
      var duoUserInput = document.getElementById('duo-username');
      var passInput = document.getElementById('password');
      var submitBtn = document.getElementById('submit');
      var tfSubmitBtn = document.getElementById('tf-submit');
      var duoSubmitBtn = document.getElementById('duo-submit');
      var alertDiv = document.getElementById('alert');
      var duoAlertDiv = document.getElementById('duo-alert');
      var username = null;
      var password = null;

      if (document.body.className.indexOf('demo') !== -1) {
        userInput.value = 'demo';
        passInput.value = 'demo';
      }

      var flashAlert = function(div) {
        var alertClass = div.className;
        var alertClassFlash = alertClass + ' flash';

        div.className = alertClassFlash;
        setTimeout(function() {
          div.className = alertClass;
          setTimeout(function() {
            div.className = alertClassFlash;
            setTimeout(function() {
              div.className = alertClass;
            }.bind(this), 150);
          }.bind(this), 150);
        }.bind(this), 150);
      };

      var setAlert = function(alert, style) {
        if (alert) {
          alertDiv.className = 'alert alert-' + (style || 'success');
          alertDiv.innerHTML = alert;
          if (alertDiv.style.display === 'block') {
            flashAlert(alertDiv);
          }
          else {
            alertDiv.style.display = 'block';
          }
        }
        else {
          alertDiv.style.display = 'none';
        }
      };

      var setDuoAlert = function(alert, style) {
        if (alert) {
          duoAlertDiv.className = 'alert alert-' + (style || 'success');
          duoAlertDiv.innerHTML = alert;
          if (duoAlertDiv.style.display === 'block') {
            flashAlert(duoAlertDiv);
          }
          else {
            duoAlertDiv.style.display = 'block';
          }
        }
        else {
          duoAlertDiv.style.display = 'none';
        }
      };

      var onSubmit = function() {
        submitBtn.disabled = true;

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
              if (JSON.parse(xmlhttp.response)['default']) {
                window.location = '/#/init';
              }
              else {
                window.location = '/';
              }
            } else if (xmlhttp.status === 202) {
              window.location = JSON.parse(xmlhttp.response)['redirect'];
            } else if (xmlhttp.status === 402) {
              username = userInput.value;
              password = passInput.value;

              otpUserInput.value = '';
              yubicoUserInput.value = '';
              tfLoginForm.style.display = 'block';

              var data = JSON.parse(xmlhttp.response);
              if (data['yubico_auth']) {
                yubicoUserInput.style.display = 'block';
                yubicoUserInput.focus();
              } else {
                yubicoUserInput.style.display = 'none';
              }
              if (data['otp_auth']) {
                otpUserInput.style.display = 'block';
                otpUserInput.focus();
              } else {
                otpUserInput.style.display = 'none';
              }

              loginForm.style.display = 'none';
              submitBtn.disabled = false;
            } else {
              var errorMsg;

              try {
                errorMsg = JSON.parse(xmlhttp.responseText)['error_msg'];
              }
              catch(error) {
                errorMsg = 'Server error occurred.';
              }

              setAlert(errorMsg, 'danger');
              submitBtn.disabled = false;
            }
          }
        };

        xmlhttp.open('POST', '/auth/session', true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify({
          'username': userInput.value,
          'password': passInput.value
        }));

        return false;
      };

      var onTwoFactor = function() {
        tfSubmitBtn.disabled = true;

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
              if (JSON.parse(xmlhttp.response)['default']) {
                window.location = '/#/init';
              }
              else {
                window.location = '/';
              }
            } else {
              tfLoginForm.style.display = 'none';
              loginForm.style.display = 'block';
              userInput.focus();

              var errorMsg;

              try {
                errorMsg = JSON.parse(xmlhttp.responseText)['error_msg'];
              }
              catch(error) {
                errorMsg = 'Server error occurred.';
              }

              setAlert(errorMsg, 'danger');
              otpUserInput.value = '';
              yubicoUserInput.value = '';
              tfSubmitBtn.disabled = false;
            }
          }
        };

        xmlhttp.open('POST', '/auth/session', true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify({
          'username': username,
          'password': password,
          'otp_code': otpUserInput.value || null,
          'yubico_key': yubicoUserInput.value || null
        }));

        return false;
      };

      var onDuo = function() {
        loginForm.style.display = 'none';
        duoLoginForm.style.display = 'block';
        duoUserInput.focus();
        return false;
      };

      var onDuoSubmit = function() {
        duoSubmitBtn.disabled = true;

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
              window.location = xmlhttp.responseText;
            } else if (xmlhttp.status === 401) {
              setDuoAlert('Unable to authenticate, please try again',
                'danger');
            } else {
              var errorMsg;

              try {
                errorMsg = JSON.parse(xmlhttp.responseText)['error_msg'];
              }
              catch(error) {
                errorMsg = 'Server error occurred';
              }

              setDuoAlert(errorMsg, 'danger');
            }
            duoSubmitBtn.disabled = false;
          }
        };

        xmlhttp.open('POST', '/sso/authenticate', true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify({
          'username': duoUserInput.value
        }));

        return false;
      };

      if (window.location.hash === '#duo') {
        onDuo();
      }
    