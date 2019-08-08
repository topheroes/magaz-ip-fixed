import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, Button, View } from 'react-native';

import { createStackNavigator, createSwitchNavigator , createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import Item from "./item.js";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const ItemsList = (props) =>
{
    const [data, setData] = useState("");

    useEffect( () =>
    {
        ( async ()=>{
            console.log(`http://${nashIp}/wp-json/custom-routes/view_products_by_cat/${props.id}`)
            let resp = await fetch(`http://${nashIp}/wp-json/custom-routes/view_products_by_cat/${props.id}`);
            console.log("Точна?")
            let respJSON = await resp.json();
            setData( respJSON );
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

var nashIp = "192.168.63.2";

const CurrentTab = (props)=>
{
    
    // console.log(props.navigation.state.key);
    const id = props.navigation.state.key;

    return (
        // <View style={styles.container}><Text>hehe</Text></View>
        <ItemsList id={id}/>
    );

}

const MainNavigator = (props) =>
{
    const [categories, setCategories] = useState(null);
    const [firstTab, setFirstTab] = useState("");
    const [error, setError] = useState(false);

    // const navigatorHandler = (cat, header) =>
    // {
    //     let name = cat["name"];

    //     let route = {}
    //     // route[name] = (props) => <ItemsList id={cat["id"]}/>
    //     // return <ItemsList id={cat["id"]}/>
    //     return  () => <ItemsList id={cat["id"]}/>
        
    // };

    useEffect(  () =>
    {

        let resp, cats;

        ( async ()=>{
           // console.log(`http://${nashIp}/wp-json/custom-routes/products_categories`);
        try{
           resp = await fetch(`http://${nashIp}/wp-json/custom-routes/products_categories`);
            cats = await resp.json();
        }catch(e){
            console.log(`error: ${e}`);
        }
        

            // if ( cats["code"] )
            // setError(true);
            // else
            { // hic dragones sunt
                cats.shift() ; // Первый элемент у нас неопределенные категории. Удаляем

                
                let categoriesNav = {};
            
                

                    cats.forEach( (cat)=>{
                        
                        
                        categoriesNav[cat["id"]] = {
                            screen: CurrentTab,
                            
                            navigationOptions: {
                                title: cat["name"],
                                id: cat["id"],
                            }
                        };
                    })
                

                // for ( cat of cats )
                // {
                //     // let tab = navigatorHandler(cat, {headerMode: "none"});

                    
                
                //     categoriesNav[cat["id"]] = {
                //         screen: CurrentTab,
                        
                //         navigationOptions: {
                //             title: cat["name"],
                //             id: cat["id"],
                //         }
                //     };
            
                    
                // }

                
                // Object.keys(categoriesNav)[0]
                setFirstTab(Object.keys(categoriesNav)[0]);
                 
                console.log(categoriesNav);

                setCategories(categoriesNav);
                
            }

        
        
        
        })();
        

        
    }, []);

    

    const Navigator = !categories ? null : createAppContainer( createMaterialBottomTabNavigator( categories, {initialRouteName: "15" } ) );
    

    return Navigator ? <Navigator/> : <Text>Loading...</Text>;
        
}



// const ItemsListNav = createAppContainer(MainNavigator);
// export default ItemsListNav;
export default MainNavigator;