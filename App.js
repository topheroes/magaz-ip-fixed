import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator, createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';

//  Это наши компоненты. 
//  Ваш Кэп.
import Cart from "./components/Cart/main.js";
import ItemsListNav from "./components/ItemsList/";
import OrderData from "./components/OrderData/main.js";
import Orders from "./components/Orders/main.js";

const MainNavigator = createMaterialTopTabNavigator(
{
    ItemsListNav: Object.assign(ItemsListNav, {navigationOptions: {title: "Главная"}}),
    Cart: {
        screen: Cart,
        navigationOptions: {
            title: "Корзина",
        },
    },
    Orders: {
        screen: Orders,
        navigationOptions: {
            title: "Заказы",
        },
    },
},
{
    initialRouteName: 'ItemsListNav',
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#694fad' },
});
  


const App = createAppContainer(MainNavigator);
export default App;