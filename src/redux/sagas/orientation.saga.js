import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import FormData from 'form-data';

function* fetchOrientation() {
  
    try{
      console.log('IN FETCH ORIENTATION')
        let orientation =  yield axios.get(`api/orientation`) //get orientation from database
         console.log('feature GET response', orientation)
 
         yield put({
             type: 'SET_ORIENTATION', //dispatch to orientation.reducer
             payload: orientation.data
         })
     } catch{
         console.log('error in orientationSaga')
     }
}

function* createOrientation(action) {
    // console.log('in createAssignment SAGA with payload of:', action.payload);
     
    //create payload object
    let data=action.payload;
    //new formdata for payload to multer and router
    let formData = new FormData();

    // console.log('video', data.assignmentVideo);
    // console.log('video[0]', data.assignmentVideo);
    //req.file
    formData.append('assignmentVideo', data.assignmentVideo);

    //req.body
    formData.append('assignmentTitle', data.assignmentTitle);
    formData.append('assignmentContent', data.assignmentContent);
    // formData.append('moduleId', data.moduleId);
    // formData.append('postClass', data.postClass);
    formData.append('textField', data.textField);
    // formData.append('file', data.file);
    // formData.append('video', data.video);
//post to server

    try{
        //send FormData to server for db query
        yield axios.post('/api/orientation', formData, {
            //must include this header, it is what Multer uses to id file
            headers:{
                headers: { "Content-Type": "multipart/form-data" },
            }
        });
        //get posts redux and rerender after store is updated
    } catch (err){
        //error route tested
        console.error('in createAssignment SAGA error', err);
    }    
}

// function* editCurrentStep(action) {
//     console.log('CURRENT STEP', action.payload)
// }

function* orientationSaga() {
  yield takeLatest('FETCH_ORIENTATION', fetchOrientation);
  yield takeLatest('CREATE_ORIENTATION', createOrientation);
//   yield takeLatest('EDIT_CURRENT_STEP', editCurrentStep);
}

export default orientationSaga;