// ======= AUTH FUNCTIONS ==========
function loginBtnClicked()
{
    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value

    const params = {
        "username": username,
        "password" : password
    }

    const url = `${baseUrl}/login`
    toggleLoader(true)
    axios.post(url, params)
    .then((response) => {        
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const modal = document.getElementById("login-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        
        showAlert("Logged in successfully", "success")
        setupUI()

    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    }).finally(()=> {
        toggleLoader(false)
    })
}



function registerBtnClicked()
{
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const image = document.getElementById("register-image-input").files[0]
    

    let formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("image", image)

    
    const headers = {
        "Content-Type": "multipart/form-data",
    }

    const url = `${baseUrl}/register`

    toggleLoader(true)
    axios.post(url, formData, {
        headers: headers
    })
    .then((response) => {
        console.log(response.data)

        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const modal = document.getElementById("register-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        
        showAlert("New User Registered Successfully", "success")
        setupUI()

    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })
}


function logout()
{
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("Logged out successfully")
    setupUI()
}


function getCurrentUser()
{
    let user = null 
    const storageUser = localStorage.getItem("user")

    if(storageUser != null)
    {
        user = JSON.parse(storageUser)
    }
    
    return user
}
