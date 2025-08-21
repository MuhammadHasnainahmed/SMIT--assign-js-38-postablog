  // import { createClient } from '@supabase/supabase-js'
  const supabaseUrl = "https://xwwowgklxvfmcjzdnhaq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3d293Z2tseHZmbWNqemRuaGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDk4MzUsImV4cCI6MjA2OTEyNTgzNX0.X3gOUHHTcB5I1x9iZy5twify2bjY2Re_YMeR6veIUpQ";
  const client = supabase.createClient(supabaseUrl, supabaseKey);

  console.log(client);

  let username = document.getElementById("username");
  let useremail = document.getElementById("email");
  let userpassword = document.getElementById("password");
  let signupForm = document.getElementById("signupForm");

  let loginForm = document.getElementById("loginForm");
  let loginemail = document.getElementById("loginemail");
  let loginpassword = document.getElementById("loginpassword");

  let usersignupname = document.getElementById("usersignupname");
  let logout = document.getElementById("logout");

  let postform = document.getElementById("postform");
  let Title = document.getElementById("Title");
  let postdiscription = document.getElementById("discription");
  let postsshow = document.getElementById("postsshow");
  let postname = document.getElementById("postname");
  let postimg = document.getElementById("postimg");

  let allpostsshow = document.getElementById("allpostsshow");
  let authoravatar = document.querySelector('.author-avatar')
  let deletebtn = document.getElementById("deletebtn");
  let editbtn = document.getElementById('editbtn')
  let sideSaveBtn = document.getElementById("sideSaveBtn");

  let postuploadbtn = document.getElementById('postuploadbtn')
  let loginbtn =document.getElementById('loginbtn')



  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();


      let usernameval = username.value;
      let email = useremail.value;
      let password = userpassword.value;

      // console.log(usernameval, emailval, passwordval);

      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: usernameval,
          },
        },
      });

      if (error) {
        console.log(error);
      } else {
        // console.log(data);
        console.log(data);
        toastr.success('Message sent successfully!');
        setTimeout(() => {
          
          window.location.href = "login.html";
        }, 1000);

      }

      username.value = "";
      useremail.value = "";
      userpassword.value = "";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      let email = loginemail.value;
      let password = loginpassword.value;
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        toastr.success('Message sent successfully!');

              
        const user = data.user;
        localStorage.setItem("username", user.user_metadata.username);
        localStorage.setItem("userid", user.id);
      
        

        setTimeout(() => {
          
          window.location.href = "index.html";
          }, 1000);
      }
  });
  }

  async function showname() {
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      console.log("No user logged in");
      return;
    }
  //   console.log(user.id);
    
    usersignupname.innerHTML = user.user_metadata.username;
      localStorage.setItem("username", user.user_metadata.username);

      localStorage.setItem("userid", user.id);
  
  }

  showname();

  if (logout) {
    logout.addEventListener("click", async function () {
      const { error } = await client.auth.signOut();

      if (error) {
        console.log(error);
      } else {
          localStorage.clear();
        toastr.success('Message sent successfully!');

        setTimeout(() => {
          window.location.href = "index.html";
        }, 500);
      }
    });
  }

  if (postform) {
    postform.addEventListener("submit", async function (e) {
      e.preventDefault();

      let title = Title.value;
      let discription = postdiscription.value;
      let username = localStorage.getItem('username')
      let unid = localStorage.getItem('userid')
      let file = postimg.files[0];
      let filename =Date.now() + "-" + file.name;
      // console.log(file);
      console.log(filename);
      
  const { data: postimgdata, error: postimgerror } = await client
    .storage
    .from('postimg')
    .upload(`publice/${filename}`, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (postimgerror) {
    console.log("post error=====>", postimgerror);
  } else {
    console.log("post add=====>", postimgdata);
  }

  const { data: publicUrlData } = client
    .storage
    .from('postimg')
    .getPublicUrl(`publice/${filename}`);
  let imageurl = publicUrlData.publicUrl;



    


      const { data,  error } = await client
        .from("post")
        .insert({ title, discription , username , unid , imageurl });
      if (error) {
        console.log(error);
      } else{
          console.log("post added" , data);
        toastr.success('Message sent successfully!');

          showpost();
          
          
      }

    
    
      

      Title.value = "";
      postdiscription.value = "";
    });
  }

  // if (postsshow) {
      
      async function showpost() {
      const userid = localStorage.getItem("userid")
      
      const usernamelogin =   localStorage.getItem("username")
      
      if (!userid) {
      console.log("No user id found");
      return;
    }
      
      const { data, error } = await client
    .from('post')
    .select('*')
    .eq('unid', userid   );


    

    if (error) {
      console.log(error);
      return
  } else {
      console.log(data);
      postsshow.innerHTML = "";
      for (let i = 0; i < data.length; i++) {
  let postimageurl = data[i].imageurl;
          postsshow.innerHTML += `
          <div class="post"
          data-id="${data[i].id}"
            data-title="${data[i].title}"
            data-discription="${data[i].discription}"
            data-popostimageurl="${postimageurl}"
            >
                      <img src="${postimageurl}" alt="Mountain landscape" class="post-image">
                      <div class="post-content">
                          <h3 class="post-title">${data[i].title}</h3>
                          <p class="post-description">${data[i].discription}.</p>
                      </div>
                      <div class="post-meta">
                          <div class="post-date">Jun 15, 2023</div>
                          <div class="post-author">
                              <div class="author-avatar">${data[i].username.charAt(0).toUpperCase()}</div>
                              <span>${data[i].username} </span>
                          </div>
                      </div>
                  </div>
        `        
      }
      
      
  }



  }
  // }
  showpost();

  // ===============popup================================
  let storedata = null;

  document.addEventListener('click' , function(e){
    let post  = e.target.closest('.post');
    // console.log(storedata);

    if (post) {
      storedata = post.dataset.id;
      let Title = post.dataset.title;       
      let discription = post.dataset.discription;
      let popostimageurl = post.dataset.popostimageurl;

      document.getElementById("popupimage").src = popostimageurl || null; 
      document.getElementById("popuptitle").innerHTML = Title;
      document.getElementById("popupdiscription").innerHTML = discription;
      document.getElementById("popupoverlay").style.display = 'flex';
    }

    if (e.target === document.getElementById("popupoverlay")) {
      document.getElementById("popupoverlay").style.display = 'none';
      
    }

    
  });

  // ==================deletebtn=============================

  if (deletebtn) {
    deletebtn.addEventListener("click", async function (e) {
      e.preventDefault();
    //  console.log("delete");
  
    const { error } = await client
      .from('post')
      .delete()
      .eq('id', storedata); 


      if (error) {
      console.log(error);
      toastr.error("Delete failed!");
    } else {
      toastr.success("Post deleted!");
      document.getElementById("popupoverlay").style.display = 'none';
      showpost(); 
    }
    //  const userid 

    });
    }


    // ==================editbtn=========================
  let title = ''
  let discription = ''
  if (editbtn) {
  editbtn.addEventListener('click', async function (e) {
      e.preventDefault();

      // console.log("update");

      document.getElementById("sidepanaloverlay").style.display = 'block';

      
    title = document.getElementById("popuptitle").innerHTML;
    discription = document.getElementById("popupdiscription").innerHTML;

    document.getElementById("sideTitle").value = title;
    document.getElementById("sideDiscription").value = discription;

    



  })
  }

  document.addEventListener('click' , function(e){
        if (e.target === document.getElementById("sidepanaloverlay")) {
        document.getElementById("sidepanaloverlay").style.display = 'none';
        
      }
  })



  if (sideSaveBtn) {
    
  sideSaveBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    // console.log("save");
    
  let upadtedimageurl = null


    
    let sideTitle = document.getElementById("sideTitle").value;
    let sideDiscription = document.getElementById("sideDiscription").value;
    let sideImageurl = document.getElementById("sidePostimg");

    if (sideImageurl.files.length > 0) {
      
      

      let file = sideImageurl.files[0];
      let filename =Date.now() + "-" + file.name;

      console.log(filename);
      

    

    // console.log(filename);

  const { data, error: uploadupdateError } = await client
    .storage
    .from('postimg')
    .upload(`publice/${filename}`, file, {
      cacheControl: '3600',
      upsert: false
    });

    if (uploadupdateError) {
      console.log(uploadupdateError);
      return;
    }

    // Public URL lena
  const { data: urlData } = client
    .storage
    .from('postimg')
    .getPublicUrl(`publice/${filename}`);

  upadtedimageurl  = urlData.publicUrl;

  console.log(upadtedimageurl);

    
    }else {
      upadtedimageurl = document.getElementById("popupimage").src;
    }




    const { error } = await client
    .from('post')
    .update({title: sideTitle , discription: sideDiscription , imageurl: upadtedimageurl })
    .eq('id', storedata); 

    if (error) {
      console.log(error);
      toastr.error("Update failed!");
    } else {
      toastr.success("Post updated!");
      document.getElementById("sidepanaloverlay").style.display = 'none';
      document.getElementById("popupoverlay").style.display = 'none';
      showpost(); 
    }

  })
  }



  // ================================================

  if (allpostsshow) {
      async function showallpost() {
        
          const { data, error } = await client
    .from('post')
    .select();
    
    console.log(data);

  let userid = localStorage.getItem('userid');
    if (userid) {
      postuploadbtn.style.display = 'flex';
         
      loginbtn.style.display = 'none';
    }else {
      postuploadbtn.style.display = 'none';
    }

    if (error) {
      console.log(error);
      
    }else{
        allpostsshow.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
          let postimageurl = data[i].imageurl;

           
          // like count

          const { count, error: countError } = await client
  .from('like')
  .select('*', { count: 'exact', head: true })
  .eq('post_id' , data[i].id);

  let likeCount = count || 0;



            allpostsshow.innerHTML += `
            <div class="post" >
                      <img src="${postimageurl}" alt="Mountain landscape" class="post-image">
                      <div class="post-content">
                          <h3 class="post-title">${data[i].title}</h3>
                          <p class="post-description">${data[i].discription}.</p>

                          <button class="like-btn" onclick="likepost(${data[i].id})">❤️ Like</button>
                          <span class="like-count" id="likecount-${data[i].id}">${likeCount}</span>
                      </div>
                      <div class="post-meta">
                          <div class="post-date">Jun 15, 2023</div>
                          <div class="post-author">
                              <div class="author-avatar">${data[i].username.charAt(0).toUpperCase()}</div>
                              <span>${data[i].username} </span>
                          </div>
                          
                      </div>
                  </div>
          `        
        }
    }



      }

      showallpost();
  }

  async function redirect() {
    const { data: { session }, error } = await client.auth.getSession();

    if (!session) {
      if (window.location.pathname.includes("dashboard.html")) {
        window.location.href = "index.html";
      }
    }
  }
  redirect();


  // let likebtn = document.getElementById("likebtn");
  // -------------------------like button-------------------------------

  // let likecount = document.getElementById(`like-count-${id}`);     
async function likepost(id) {
  console.log("like", id);

  let userid = localStorage.getItem("userid");
  console.log(userid);

   if (!userid) {
    toastr.warning("Please login to like posts!");
    return;
  }



  // check if already liked
  const { data: existing, error: selectError } = await client
    .from("like")
    .select("*")
    .eq("post_id", id)
    .eq("user_id", userid)
    .maybeSingle();

  if (existing) {
    console.log("Already liked");
    toastr.info("You already liked this post");
    return;
  }

  const { error } = await client
    .from("like")
    .insert({ post_id: id, user_id: userid });

  if (error) {
    console.log(error);
  } else {
    console.log("like added");
    toastr.success("Liked!");

     const { count, error: countError } = await client
      .from("like")
      .select("*", { count: "exact", head: true })
      .eq("post_id", id);

    if (!countError) {
      document.getElementById(`likecount-${id}`).innerText = count;
    }


    // showallpost();
  }


}

    

