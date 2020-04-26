'use strict';
const userForm = new UserForm();
userForm.loginFormCallback = data => {	
	ApiConnector.login(data, responce => {
		if (responce.success) {
			location.reload();
		} else {
			userForm.setLoginErrorMessage(responce.data);
		}
	})
}

userForm.registerFormCallback = (data) => {
	ApiConnector.register(data, responce => {
		if (responce.success) {
		location.reload();
	} else {
		userForm.setRegisterErrorMessage(responce.data);
	  }
	})
}
