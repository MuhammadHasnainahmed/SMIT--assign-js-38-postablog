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

let allpostsshow = document.getElementById("allpostsshow");

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
        
         window.location.href = "dashboard.html";
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

    console.log(title, discription  ,username , unid);


    const { data,  error } = await client
      .from("post")
      .insert({ title, discription , username , unid });
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
  .eq('unid', userid  );


  

  if (error) {
    console.log(error);
    return
} else {
    console.log(data);
    postsshow.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        postsshow.innerHTML += `
        <div class="post">
        <h2>${data[i].title}</h2>
        <p>${data[i].discription}</p>
        <p>${usernamelogin}</p>
        </div>
      `        
    }
    
    
}



}
// }
showpost();

if (allpostsshow) {
    async function showallpost() {
        const { data, error } = await client
  .from('post')
  .select();
   
  console.log(data);

   if (error) {
     console.log(error);
     
   }else{
       allpostsshow.innerHTML = "";
       for (let i = 0; i < data.length; i++) {
           allpostsshow.innerHTML += `
           <div class="post">
           <h2>${data[i].title}</h2>
           <p>${data[i].discription}</p>
           <p>${data[i].username}</p>
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
  }else{
    console.log(error);
    
  }
}
redirect();

