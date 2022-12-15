import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { useParams, useHistory } from 'react-router-dom';
import { Markup } from 'interweave';



// ROUTE: /admin/assignment/edit/:id
function EditAssignment () {
//import user
const user = useSelector(store => store.user);
//setup
const dispatch = useDispatch();
const params = useParams();
const history = useHistory();
const editAssignment = useSelector(store => store.assignments.editAssignmentReducer);

useEffect(() => {
    dispatch ({
        type: 'FETCH_EDIT_ASSIGNMENT',
        payload: params.id
    });
},[]);


// console.log(user.accessLevel)
// import useState and create state for selected file on video upload
const [assignmentVideo, setAssignmentVideo] = useState('');
//use usestate to track content of WYSIWYG
const [assignmentContent, setAssignmentContent] = useState('');
//useState to track assignment title
const [assignmentTitle, setAssignmentTitle] = useState('');

//submission types
const [textField, setTextField] = useState(false);
const [fileSubmission, setFileSubmission] = useState(false);
const [postClass, setPostClass] = useState(false);
const [videoSubmission, setVideoSubmission] = useState(false);

const submitAssignment = (evt) => {
    evt.preventDefault();
    console.log('in submit assignment');
    //ensure there is content in the WYSIWYG
    if(assignmentContent.length <=10){
        alert('Must put content into the assignment');
        return
    }

    //dispatch to the SAGA for serverpost route
    dispatch({
        type: 'CREATE_ASSIGNMENT',
        payload: {
            assignmentVideo,
            assignmentContent,
            assignmentTitle,
            moduleId: params.moduleId,
            postClass,
            textField,
            // name to match database, lef as submission so there isnt confusion on this page
            file: fileSubmission,
            video: videoSubmission,
        }
    })
    //push to modules view
    history.push(`/admin/modules/${params.seriesId}`)

}


// console.log('assignmentcontent', assignmentContent);


    const handleImageUploadBefore= (files, info, uploadHandler) => {
        // uploadHandler is a function
        // console.log(files, info)
        
        const callBack = async () => { 
        let formData = new FormData();
        formData.append('image', files[0]);
        const response = await axios.post('/api/assignments/imagefield', formData, {
            //must include this header, it is what Multer uses to id file
            headers:{
                headers: { "Content-Type": "multipart/form-data" },
            }});
        console.log('response', response.data);
        uploadHandler(response.data);}

        callBack();
        // uploadHandler();

    }

    const handleChange = (content) => {
        setAssignmentContent(content);
    }

//testing logs
// console.log('submission types, textfield:', textField, 'fileSubmission', fileSubmission);
// console.log('pre class should be false:', postClass);
// console.log('video submission', videoSubmission);
    return(
        <>
            {/* <video width="320" height="240" controls src="/videos/assignmentVideo1670963030995.mov">
            
            </video> */}

        
            <form onSubmit={submitAssignment}>
                <label>Upload Video
                    <input 
                        accept="video/*"               
                        type='file' 
                        name="selectedVideo"
                        onChange = {(evt) => setAssignmentVideo(evt.target.files[0])}

                    />
                </label>
                <input 
                    required
                    type='text' 
                    placeholder="Assignment Name"
                    onChange={(evt)=>setAssignmentTitle(evt.target.value)}
                />
                <SunEditor 
                onChange={handleChange}
                setOptions={{
                    height: 200,
                    buttonList: [
                        ['font', 'align'],
                        ['fontSize'],                          
                        ['italic'],
                        ['bold'],
                        ['underline'],
                        ['video'],
                        ['image'],                                       
                    ]                                        
                }}
                onImageUploadBefore={handleImageUploadBefore} 
                //  setContents={content}
            />
            
            <div>
                <label>Pre Class</label>
                <input defaultChecked onClick={()=>setPostClass(false)} type="radio" name="classType" className="valueRadio"></input>
                <label>Post Class</label>
                <input onClick={()=>setPostClass(true)} type="radio" name="classType" className="valueRadio"></input>
            </div>
            <div>
                <h3>Submission type</h3>
                <label>Textfield</label>
                <input  onClick={()=>setTextField(!textField)} type="checkbox" name="textField" className="valueRadio"></input>
                <label>File</label>
                <input onClick={()=>setFileSubmission(!fileSubmission)}type="checkbox" name="fileSubmission" className="valueRadio"></input>
                <label>Video</label>
                <input onClick={()=>setVideoSubmission(!videoSubmission)}type="checkbox" name="fileSubmission" className="valueRadio"></input>
            </div>
                

            <button type="submit">Create Assignment</button>
            </form>
        </>
)

};

export default EditAssignment;