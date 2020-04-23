'use strict';
const logoutButton = new LogoutButton();
logoutButton.action = () => {
	ApiConnector.logout(callback => {
		if (callback.success === true)
			location.reload();
	});
}

ApiConnector.current(callback => {
	if (callback.success === true){
		return ProfileWidget.showProfile(callback.data);
	}
});

const ratesBoard = new RatesBoard();

function getExchangeRates(){
	ApiConnector.getStocks(callback => {
		if (callback.success === true) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(callback.data);
		}
	})
}

setTimeout(getExchangeRates(), 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
	ApiConnector.addMoney(data, callback =>{
		if (callback.success === false) {
			moneyManager.setMessage(true, "Ошибка пополнения баланса");
		} else {
			ProfileWidget.showProfile(callback.data);
			moneyManager.setMessage(false, "Баланс пополнен!");
		}
	})	
}
moneyManager.conversionMoneyCallback = (data) => {
	ApiConnector.convertMoney(data, callback => {
		if (callback.success === false) {
			moneyManager.setMessage(true, "Ошибка конвертации");
		} else {
			ProfileWidget.showProfile(callback.data);
			moneyManager.setMessage(false, "Конвертация прошла успешно!");
		}
	})
}

moneyManager.sendMoneyCallback = (data) => {
	ApiConnector.transferMoney(data, callback => {
		if (callback.success === false) {
			moneyManager.setMessage(true, "Ошибка перевода валюты");
		} else {
			ProfileWidget.showProfile(callback.data);
			moneyManager.setMessage(false, "Перевод валюты прошел успешно!");
		}
	})
}

const favoritesWidget = new FavoritesWidget();
const getFavoritesWidget = () => {
	let result = {};
	ApiConnector.getFavorites(callback => {
		if (callback.success === true) {
			result = callback.data;
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(result);
			moneyManager.updateUsersList(result);
		} 
	})
	return result;
}

favoritesWidget.addUserCallback = (data) => {
	ApiConnector.addUserToFavorites(data, callback => {
		if (callback.success === false) {
			favoritesWidget.setMessage(true, "Ошибка добавления пользователя в список избранных");
		} else {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(getFavoritesWidget());
			moneyManager.updateUsersList(getFavoritesWidget());
			favoritesWidget.setMessage(false, "Пользователь успешно добавлен");
		}
	})
}

favoritesWidget.removeUserCallback = (id) => {
	ApiConnector.removeUserFromFavorites(id, callback => {
		if (callback.success === false) {
			favoritesWidget.setMessage(true, `Ошибка удаления пользователя с ID ${id}`);
		} else {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(getFavoritesWidget());
			moneyManager.updateUsersList(getFavoritesWidget());
			favoritesWidget.setMessage(false, `Пользователь ID ${id} удален`);
		}
	})
}
