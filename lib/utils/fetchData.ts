
import { collection, deleteDoc, getDocs, getFirestore, query, doc, where } from "firebase/firestore";
import { app } from '@/firebase/firebase';

const db = getFirestore(app);

export async function fetchDataUser () {
    const q = query(collection(db, 'users'));
        try {
            const querySnapshot = await getDocs(q);
            const userDataArray: any = [];
            querySnapshot.forEach((doc) => {
                userDataArray.push(doc.data());
            });
            return userDataArray;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
};

export async function fetchDataPost(status: string[] = []) {
    let q;
    if (status.length > 0) {
        q = query(collection(db, 'posts'), where('status', 'in', status));
    } else {
        q = query(collection(db, 'posts'));
    }
    try {
        const querySnapshot = await getDocs(q);
        const postDataArray: any = [];
        querySnapshot.forEach((doc) => {
            postDataArray.push(doc.data());
        });
        return postDataArray;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export async function fetchDetailPost(slug: any) {
    let q = query(collection(db, 'posts'), where('slug', '==', slug));

    try {
        const querySnapshot = await getDocs(q);
        const postDataArray: any = [];
        querySnapshot.forEach((doc) => {
            postDataArray.push(doc.data());
        });
        return postDataArray[0];
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export async function fetchDataSetting () {
    const q = query(collection(db, 'settings'));
    try {
        const querySnapshot = await getDocs(q);
        const settingDataArray: any = [];
        querySnapshot.forEach((doc) => {
            settingDataArray.push(doc.data());
        });
        return settingDataArray[0];
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export async function fetchDataCategories (slug: any) {
    let q;
    if (slug) {
        q = query(collection(db, 'categories'), where('slug', '==', slug));
    } else {
        q = query(collection(db, 'categories'));
    }
    try {
        const querySnapshot = await getDocs(q);
        const categoriesDataArray: any = [];
        querySnapshot.forEach((doc) => {
            categoriesDataArray.push(doc.data());
        });
        return categoriesDataArray;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
