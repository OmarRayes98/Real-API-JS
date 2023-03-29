setupUI()

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('postId');

getPost()

function getPost() {
    toggleLoader(true);

    axios.get(`${baseUrl}/posts/${id}`)
    .then((response) => {
        toggleLoader(false);

        const data = response.data
        const post = data.data
        const comments = post.comments
        console.log(post)
        fillPost(post)
        fillComments(comments)
    })
}


function fillPost(post)
{
    document.getElementById("post").innerHTML = ""
    const author = post.author
    const content = 
    `
    <div class="card shadow-sm mb-5">
        <div class="card-header">                      
            <img src="${author.profile_image}" class="img-thumbnail rounded-5" style="width: 40px; height: 40px">
            <b>@${author.username}</b>
        </div>

        
        <div class="card-body" onclick="postClicked(1)">
            <img src="${post.image}" class="card-img-top">
            <h6 style="color: rgb(171, 171, 171)">
                2 min ago
            </h6>

            <h5 class="card-title">
                
            </h5>

            <p class="card-text">
                ${post.body}
            </p>

            <hr>

            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg>
                <span>
                    Comments (${post.comments_count})
                </span>

            </div>

        </div>

        <hr>   

        <!-- COMMENTS -->
            <div id="comments">
                
                <!-- COMMENT -->
                <div class="p-3 rounded-3" style="background: rgb(241, 246, 255)">
                    <div>
                        <img src="./profile-pics/1.png" class="img-thumbnail rounded-5" style="width: 40px; height: 40px">
                        <b>@yarhmm</b>
                    </div>

                    <div  >
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam numquam odio totam, aspernatur neque nisi sit assumenda a iure harum! Reprehenderit accusantium animi quam repellat saepe modi! Ullam, porro eaque.
                    </div>
                </div>
                <!--// COMMENT //-->

                <!-- COMMENT -->
                <div class="p-3 rounded-3 mt-3" style="background: rgb(241, 246, 255)">
                    <div>
                        <img src="./profile-pics/1.png" class="img-thumbnail rounded-5" style="width: 40px; height: 40px">
                        <b>@yarhmm</b>
                    </div>

                    <div  >
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam numquam odio totam, aspernatur neque nisi sit assumenda a iure harum! Reprehenderit accusantium animi quam repellat saepe modi! Ullam, porro eaque.
                    </div>
                </div>
                <!--// COMMENT //-->
            </div>
            <!--// COMMENTS //-->
            
            <div class="input-group mb-3" id="add-comment-div">                            
                <input id="comment-input" type="text" placeholder="add your comment.." class="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">
                <button class="btn btn-outline-primary" type="button" id="button-addon1" onclick="createCommentClicked()">send</button>
            </div>
    </div>   
    `
    document.getElementById("post").innerHTML = content
    document.getElementById("username-span").innerHTML = post.author.username
}

function fillComments(comments)
{
    const commentsDiv = document.getElementById("comments") 
    commentsDiv.innerHTML = ""
    comments.forEach(comment => {
        console.log(comment)                       
        const content = 
        `
            <!-- COMMENT -->
            <div class="p-3 rounded-3" style="background: rgb(241, 246, 255)">
                <div>
                    <img src="${comment.author.profile_image}" class="img-thumbnail rounded-5" style="width: 40px; height: 40px">
                    <b>${comment.author.username}</b>
                </div>

                <div>
                    ${comment.body}
                </div>
            </div>
            <!--// COMMENT //-->
        `
        commentsDiv.innerHTML += content
    });
}

function createCommentClicked()
{
    
    let body = document.getElementById("comment-input").value        
    let params = {"body" : body}
    let token = localStorage.getItem("token")

    axios.post(`${baseUrl}/posts/${id}/comments`, params, {
        headers: {
            "Content-Type": "multipart/form-data",
            "authorization": `Bearer ${token}`
        }
    })
    .then(() => {            
        getPost()
        showAlert("The comment has been added successfully", "success")
    }).catch((error) => {        
        showAlert(error.response.data.message, "danger")
    })
}