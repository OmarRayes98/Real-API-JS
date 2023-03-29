// const baseUrl = "http://localhost:3030/api/v1"
const baseUrl = "https://tarmeezAcademy.com/api/v1";

// ======= POST REQUESTS ======////
function createNewPostClicked() {
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""
    


    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const image = document.getElementById("post-image-input").files[0]
    const token = localStorage.getItem("token")

    let formData = new FormData()
    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)


    let url = ``        
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }

    if(isCreate)
    {
        url = `${baseUrl}/posts`            

    }else {

        formData.append("_method", "put")
        url = `${baseUrl}/posts/${postId}`
    }

    toggleLoader(true)
    axios.post(url, formData, {
        headers: headers
    })
    .then((response) => {
        const modal = document.getElementById("create-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New Post Has Been Created", "success")
        getPosts()

    })
    .catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })

    
}

function editPostBtnClicked(postObject)
{
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    
    document.getElementById("post-modal-submit-btn").innerHTML = "Update"
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}

function deletePostBtnClicked(postObject)
{
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)

    document.getElementById("delete-post-id-input").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModal.toggle()
}

function confirmPostDelete() {
    const token = localStorage.getItem("token")
    const postId = document.getElementById("delete-post-id-input").value
    const url = `${baseUrl}/posts/${postId}`
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }


    axios.delete(url, {
        headers: headers
    })
    .then((response) => {
        const modal = document.getElementById("delete-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("The Post Has Been Deleted Successfully", "success")
        getPosts()

    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })
}


function profileClicked()
{
    const user = getCurrentUser()
    console.log(user)
    const userId = user.id
    window.location = `profile.html?userid=${userId}`
}
function setupUI()
{
    const token = localStorage.getItem("token")

    const loginDiv = document.getElementById("logged-in-div")
    const logoutDiv = document.getElementById("logout-div")
    const profileLi = document.getElementById("nav-profile");

    // add btn
    const addBtn = document.getElementById("add-btn")

    if(token == null) // user is guest (not logged in)
    {
        if(addBtn != null)
        {
            addBtn.style.setProperty("display", "none", "important")
        }
        
        loginDiv.style.setProperty("display", "flex", "important")
        logoutDiv.style.setProperty("display", "none", "important")
        profileLi.style.setProperty("display", "none", "important")

    }else { // for logged in user

        if(addBtn != null)
        {
            addBtn.style.setProperty("display", "block", "important")
        }
        
        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "flex", "important")
        profileLi.style.setProperty("display", "flex", "important")


        const user = getCurrentUser()
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-user-image").src = user.profile_image
    }
}

//Loader && Alert

function toggleLoader(show = true)
{
    if(show)
    {
        document.getElementById("loader").style.visibility = 'visible'
    }else {
        document.getElementById("loader").style.visibility = 'hidden'
    }
}

function showAlert(customMessage, type="success")
{
    const alertPlaceholder = document.getElementById('success-alert')

    const alert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    alert(customMessage, type) 
    
    setTimeout(() => {
        bootstrap.Alert.getOrCreateInstance(document.querySelector(".alert")).close();
    }, 1500);
    
    
}
