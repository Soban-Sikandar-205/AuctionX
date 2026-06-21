import axios from 'axios'
import { auctionActions } from './slices'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { databaseURL as baseurl, storage } from '../firebaseConfig';

const imgConversion = async (images) => {
    try {
      const imgUrls = [];
      const imageFiles = images;
    
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        const storageRef = ref(storage, `images/${imageFile.name}`);
    
        const snapshot = await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
         
        imgUrls.push(downloadURL);
      }
        return imgUrls;
    } catch (error) {
      console.error('Error during image conversion:', error);
      throw new Error('Image conversion failed'); 
    }
  };
  

export const postItem = async (data) => {
   
    try {
        let imgUrls = data.imgUrls;
        if (!imgUrls && data.images) {
            imgUrls = await imgConversion(data.images);
        }
        const updatedData = { ...data };
        if (imgUrls) {
            updatedData.imgUrls = imgUrls;
        }
        if (updatedData.images) {
            delete updatedData.images;
        }
        await axios.post(`${baseurl}/auctionitems/${(data.category).toLowerCase()}.json`, { ...updatedData, startingBid:data.startingBid })
        console.log('Data added', updatedData)
    }
    catch (error) {
      console.error('Error during postItem:', error);
      throw new Error(error.message || 'Post Item failed'); 
    }
}

export const retrieveItems = () => {
    return async (dispatch) => {
        let allItems
        await axios.get(`${baseurl}/auctionitems.json`)
            .then(resp => allItems = resp.data)
            .catch(() => {throw new Error("Could not retrieve items")})

        //    console.log(allItems)
        let formateditems = {}

        for (let ceta in allItems) {
            const allitems = allItems[ceta]
            const items = []
            for (let item in allitems) {
                // console.log(item)
                items.push({ key: item, ...allitems[item] })
            }
            formateditems[ceta] = items
        }
        //    console.log(formateditems.furniture)

        dispatch(auctionActions.setItems(formateditems))


    }

}

export const placeBid = async (bid, item, bidder, userName, cetagory, itemOwner) => {
        await axios.put(`${baseurl}/auctionitems/${cetagory.toLowerCase()}/${item}/startingBid.json`, bid)
        await axios.post(`${baseurl}/auctionitems/${cetagory.toLowerCase()}/${item}/recentBids.json`, {item: item, user:bidder, userName:userName, bid:bid, owner:itemOwner})
        .then(()=>console.log('Bid Places'))
        .catch(() =>{throw new Error("Could not place Bid, Some thing went wrong")})


}

export const deleteItem =async (id, cetagory) =>{
    console.log(id, cetagory)
    await axios.delete(`${baseurl}/auctionitems/${cetagory.toLowerCase()}/${id}.json`)
    .then(()=> console.log('deleted'))
    .catch(() => {throw new Error("Could not delete item")})
}


export const editItem = async (item, data) => {
    try {
      let imgUrls = data.imgUrls;
      if (!imgUrls && data.images && data.images.length > 0) {
         imgUrls = await imgConversion(data.images);      
      }
      const updatedData = { ...data };
      if (imgUrls) {
         updatedData.imgUrls = imgUrls;
      }
      if (updatedData.images) {
         delete updatedData.images;
      }
  
      await axios.patch(`${baseurl}/auctionitems/${data.category.toLowerCase()}/${item}.json`, updatedData);
      
      console.log('Item edited successfully');
    } catch (err) {
      console.error('Error during editItem:', err);
      throw new Error(err.message || "Could not edit item, something went wrong")
    }
    
    // Log item and data after all operations are complete
    console.log(item, data);
  }



  export const handleWinner =async (winner, cetagory)=>{
    await axios.post(`${baseurl}/auctionitems/${cetagory.toLowerCase()}/${winner.item}/winner.json`, winner)
    .then(()=>'Winner Decided')
  .catch(() => {throw new Error("Something went wrong, Could not announce winner")})
  }




