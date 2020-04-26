'use strict';
const logoutButton = new LogoutButton();
logoutButton.action = () => {
	ApiConnector.logout(callback => {
		if (callback.success)
			location.reload();
	});
}

ApiConnector.current(callback => {
	if (callback.success){
		return ProfileWidget.showProfile(callback.data);
	}
});

const ratesBoard = new RatesBoard();

function getExchangeRates(){
	ApiConnector.getStocks(callback => {
		if (callback.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(callback.data);
			console.log(callback);
		}
	})
}
getExchangeRates();
setInterval(() => getExchangeRates(), 60000);//правильно ли я добавила именно setInterval?


const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
	ApiConnector.addMoney(data, callback => {
		if (!callback.success) {
			moneyManager.setMessage(true, `${callback.data}`);//вывожу сообщение из data, здесь и далее
		} else {
			ProfileWidget.showProfile(callback.data);
			moneyManager.setMessage(false, "Баланс пополнен!");
		}
	})	
}
moneyManager.conversionMoneyCallback = (data) => {
	ApiConnector.convertMoney(data, callback => {
		if (!callback.success) {
			moneyManager.setMessage(true, `${callback.data}`);
		} else {
			ProfileWidget.showProfile(callback.data);
			moneyManager.setMessage(false, "Конвертация прошла успешно!");
		}
	})
}

moneyManager.sendMoneyCallback = (data) => {
	ApiConnector.transferMoney(data, callback => {
		if (!callback.success) {
			moneyManager.setMessage(true, `${callback.data}`);
		} else {
			ProfileWidget.showProfile(callback.data);
			moneyManager.setMessage(false, "Перевод валюты прошел успешно!");
		}
	})
}

const favoritesWidget = new FavoritesWidget();
function getFavoritesWidget() {
	ApiConnector.getFavorites(callback => {
		if (callback.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(callback.data);
			moneyManager.updateUsersList(callback.data);
		} 
	})
}
getFavoritesWidget(); //доработала функцию. Идет её вызов при загрузке страницы, больше её не вызываю.

favoritesWidget.addUserCallback = (data) => {
	ApiConnector.addUserToFavorites(data, callback => {
		if (!callback.success) {
			favoritesWidget.setMessage(true, `${callback.data}`);
		} else {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(callback.data);//отрисовываю таблицу данными из коллбека- здесь и далее
			moneyManager.updateUsersList(callback.data);
			favoritesWidget.setMessage(false, "Пользователь успешно добавлен");
		}
	})
}

favoritesWidget.removeUserCallback = (id) => {
	ApiConnector.removeUserFromFavorites(id, callback => {
		if (!callback.success) {
			favoritesWidget.setMessage(true, `${callback.data}`);
		} else {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(callback.data);
			moneyManager.updateUsersList(callback.data);
			favoritesWidget.setMessage(false, `Пользователь ID ${id} удален`);
		}
	})
}

