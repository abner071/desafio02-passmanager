import React, { 
    createContext, 
    useContext, 
    ReactNode, 
} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StorageProviderProps {
    children: ReactNode;
}

interface LoginDataProps {
    id: string;
    title: string;
    email: string;
    password: string;
};

type LoginListDataProps = LoginDataProps[];

interface StorageContextData {
    getItem(): Promise<LoginListDataProps>;
    setItem({}: LoginDataProps): Promise<void>;
}

const StorageContext = createContext({} as StorageContextData);

function StorageProvider({ children }: StorageProviderProps){
    const dataKey = "@passmanager:logins";

    async function getItem(){
        const response = await AsyncStorage.getItem(dataKey);

        if(response){        
            return JSON.parse(response);
        }else{
            return [];
        }
    }

    async function setItem(newData: LoginDataProps){
        try{
            const currentData = await getItem();

            const dataFormatted = [
                ...currentData,
                newData
            ];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível cadastrar o login");
        }
    }

    return (
        <StorageContext.Provider value={{
            getItem,
            setItem
        }}>
            { children }
        </StorageContext.Provider>
    )
}


function useStorageData(){
    const context = useContext(StorageContext);

    return context;
}

export { StorageProvider, useStorageData }