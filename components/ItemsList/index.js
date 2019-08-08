import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, Button, View } from 'react-native';

import { createStackNavigator, createSwitchNavigator , createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import Item from "./item.js";

var API_ADDRESS = "192.168.1.215";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const ItemsList = () =>
{
    const id = props.navigation.state.key;

    const [data, setData] = useState("");

    useEffect( () =>
    {
        ( async () =>
        {
            let resp = await fetch(`http://${API_ADDRESS}/wp-json/custom-routes/view_products_by_cat/${id}`);
            let respJSON = await resp.json();

            setData(respJSON);
        })();

    }, []);
    
    return (
        <ScrollView alwaysBounceVertical>
            {data ? data.map((v, i) =>
            {
                return <Item key={i} productData={v}/>;
            }) : <Text>Загрузка...</Text>}
        </ScrollView>
    );
}

const MainNavigator = (props) =>
{
    const [categories, setCategories] = useState(null);
    const [firstTab, setFirstTab] = useState("");
    const [error, setError] = useState(false);
    const [loadingEffect, setLoadingEffect] = useState(".");

    useEffect( () =>
    {
        let resp, cats;

        ( async () =>
        {
            try
            {
                resp = await fetch(`http://${API_ADDRESS}/wp-json/custom-routes/products_categories`);
                cats = await resp.json();
            }
            catch(e)
            {
                setError(true);
            }
        

            if ( cats["code"] )
                setError(true);
            else
            {                
                let categoriesNav = {};

                for ( cat of cats )
                {
                    if ( cat["name"] == "Uncategorized" )
                        continue;
                    
                    categoriesNav[cat["id"]] = {
                        screen: ItemsList,
                        
                        navigationOptions: {
                            title: cat["name"],
                            id: cat["id"],
                        },
                    };
                }
                setFirstTab(Object.keys(categoriesNav)[0]);
                setCategories(categoriesNav);
            }
        })();

    }, []);

    const loadingEffectTimeout = setTimeout( () =>
    {
        if ( Navigator || error )
            clearTimeout(loadingEffectTimeout);

        if ( loadingEffect == "..." )
            setLoadingEffect(".");
        else
            setLoadingEffect(loadingEffect + ".");
    }, 800);
    
    const Navigator = !categories ? null : createAppContainer( createMaterialBottomTabNavigator(categories, {initialRouteName: "16"}) );
    
    return Navigator ? <Navigator/>
        : error ? <Text>Произошла ошибка при получении данных с сервера.</Text>
            : <Text>Загрузка{loadingEffect}</Text>;
}

export default MainNavigator;