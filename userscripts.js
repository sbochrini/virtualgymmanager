  $(document).ready(function(){

    getUsers();

    // Get items from API
    function getUsers(){
      $.ajax({
        url:'/virtuagymapi/public/api/users'
      }).done(function(response){
        var users_html = '';
        var plans_dropdown = '';
         $.each(response.plans, function(key, plan){
                 plans_dropdown += `<option value="${plan.id}">${plan.plan_name}</option>`;
          });
        $.each(response.users, function(key, user){
          users_html += `
          <li class="list-group-item mb-1">
              <div class="row">
                  <div class="col-md-auto">
                      <img src="/virtuagymapi/public/user.png" style="height: 117px; width: 117px;">
                  </div>
                  <div class="col">
                      <div class="row">
                          <div class="col">
                              <div id="user_cardtitle_${user.id}" class="card-title">${user.firstname} ${user.lastname}</div>
                          </div>
                          <div class="col">
                              <div class="row mb-3">
                                  <div class="col">
                                      <button class="editUser btn btn-outline-dark btn-sm" data-id="${user.id}"><i class="far fa-edit"></i> Edit</button>
                                  </div>
                                  <div class="col">
                                      <button class="showUser btn btn-outline-info btn-sm" data-id="${user.id}"><i class="fas fa-eye"></i> View</button>
                                  </div>
                              </div>
                              <div class="row">
                                  <div class="col">
                                      <button class="deleteUser btn btn-outline-danger btn-sm" data-id="${user.id}"><i class="far fa-trash-alt"></i> Delete</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="row">
                          <div class="col">
                              <a data-toggle="collapse" href="#user_collapse${user.id}" role="button" aria-expanded="false" aria-controls="user_collapse${user.id}">
                                  <small>Details</small>
                              </a>
                              <div class="collapse" id="user_collapse${user.id}">
                                  <div class="card">
                                      <div class="card-body">
                                          <p id="p_useremail_${user.id}" class="card-text"><small>Email: ${user.email}</small></p>
                                          <p id="p_userphone_${user.id}" class="card-text"><small>Phone: ${user.phone}</small></p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </li>
          `;
        });

        $('#users_ul').append(users_html);
        $('#userplans_select').append(plans_dropdown);
      });
    }

    //add new plan form generate with button
    $('#btn_add_userform').on('click', function(){
      $.ajax({
        url:'/virtuagymapi/public/api/addusersform'
      }).done(function(response){
        let plans_dropdown = '';
        let output = '';
         $.each(response, function(key, plan){
                 plans_dropdown += `<option value="${plan.id}">${plan.plan_name}</option>`;
          });
        //console.log(response.difficulty_levels);
          output += `
          <div class="card col-md mt-4 order-md-1 sticky-top">
                    <h4 class="mb-3 mt-3">User Editor</h4>
                     <form  id="form_adduser" method="post" class="userForm" data-id="">
                      <div class="form-group">
                             <label for="Firstame">Firstame</label>
                             <input id="firstname" class="form-control" name="firstname" type="text" required>
                             <div class="invalid-feedback" id="invalid_firstname">

                             </div>
                          </div>

                          <div class="form-group">
                             <label for="Lastame">Lastname</label>
                             <input id="lastname" class="form-control" name="lastname" type="text">
                             <div class="invalid-feedback" id="invalid_lastname">

                             </div>
                          </div>

                          <div class="form-group">
                             <label for="E-mail Address">E-mail Address</label>
                             <input id="email" class="form-control" name="email" type="text" >
                             <div class="invalid-feedback" id="invalid_email">

                             </div>
                          </div>

                          <div class="form-group">
                             <label for="phone">Phone</label>
                             <input id="phone" class="form-control" name="phone" type="text">
                          </div>
                             <div class="form-group">
                             <label for="Plans">Plans</label>
                             <select id="userplans_select" class="form-control" name="plans" multiple>

                                 `+plans_dropdown+`

                             </select>
                          </div>
                        <div class="form-group">
                           <input class="btn btn-success float-right" type="button" value="Save" id="btn_user" data-form="add"  onclick="storeUser()"></input>
                        </div>
                    </form>
                    <hr class="mb-4">
                </div>
          <hr>
          `;
        //  $('#div_add_user').empty();
        $('#div_add_user').html(output);
      });
    });

    //Submit event
    // $('#form_adduser').on('submit', function(e){
    //     e.preventDefault();
    //
    //     let firstname = $('#firstname').val();
    //     let lastname = $('#lastname').val();
    //     let email = $('#email').val();
    //     let phone = $('#phone').val();
    //     let plans = $('#userplans_select').val();
    //
    //     addUser(firstname, lastname, email, phone, plans);
    //   });
    //
    //   // Insert items using api
    //   function addUser(firstname, lastname, email, phone, plans){
    //
    //   }


    // Delete event
    $('body').on('click', '.deleteUser', function(e){
      e.preventDefault();

      let id = $(this).data('id');

      deleteUser(id);
    });

    // Delete item through api
    function deleteUser(id){
      $.ajax({
        method:'POST',
        url:'/virtuagymapi/public/api/users/'+id,
        data: {_method: 'DELETE'}
      }).done(function(users){
        alert('User deleted');
        location.reload();
      });
    }

    $('body').on('click', '.editUser', function(e){
      e.preventDefault();

      let id = $(this).data('id');

      editUser(id);
    });

    // Delete item through api
    function editUser(id){
      $.ajax({
        method:'GET',
        url:'/virtuagymapi/public/api/users/'+id+'/edit',
      }).done(function(response){
        var plans_dropdown='';
        $.each(response.plans, function(key, plan){
          if(response.user_plans.length>0){
            //$.each(response.user_plans, function(i,userplan){
              if(response.user_plans.indexOf(plan.id)!==-1 ){
                plans_dropdown += `<option value="${plan.id}" selected>${plan.plan_name}</option>`;
              }else{
                  plans_dropdown += `<option value="${plan.id}">${plan.plan_name}</option>`;
              }
            //});
          }else{
            plans_dropdown += `<option value="${plan.id}">${plan.plan_name}</option>`;
          }
         });
        output = `
        <div class="card col-md mt-4 order-md-1 sticky-top">
                  <h4 class="mb-3 mt-3">User: ${response.user.firstname} ${response.user.lastname}</h4>
                   <form  id="form_edituser" method="put" class="userForm" data-id="${response.user.id}">
                    <div class="form-group">
                           <label for="Firstame">Firstame</label>
                           <input id="firstname" class="form-control" name="firstname" type="text" value="${response.user.firstname}" required>
                           <div class="invalid-feedback" id="invalid_firstname">

                           </div>
                        </div>

                        <div class="form-group">
                           <label for="Lastame">Lastame</label>
                           <input id="lastname" class="form-control" name="lastname" type="text" value="${response.user.lastname}">
                           <div class="invalid-feedback" id="invalid_lastname">

                           </div>
                        </div>

                        <div class="form-group">
                           <label for="E-mail Address">E-mail Address</label>
                           <input id="email" class="form-control" name="email" type="text" value="${response.user.email}">
                           <div class="invalid-feedback" id="invalid_email">

                           </div>
                        </div>

                        <div class="form-group">
                           <label for="phone">Phone</label>
                           <input id="phone" class="form-control" name="phone" type="text" value="${response.user.phone}">
                        </div>
                           <div class="form-group">
                           <label for="Plans">Plans</label>
                           <select id="userplans_select" class="form-control" name="plans" multiple>

                               `+plans_dropdown+`

                           </select>
                        </div>
                      <div class="form-group">
                         <input class="btn btn-success float-right" type="button" value="Save" id="btn_user" data-form="edit"  onclick="updateUser()"></input>
                      </div>
                  </form>
                  <hr class="mb-4">
              </div>
        <hr>
        `;
        $('#div_add_user').html(output);
      });
    }

    $('body').on('click', '.showUser', function(e){
      e.preventDefault();

      let id = $(this).data('id');

      showUser(id);
    });

    function showUser(id){
      $.ajax({
        method:'GET',
        url:'/virtuagymapi/public/api/users/'+id,
        data: {_method: 'GET'}
      }).done(function(response){
        var card_plan="";
        var card_exercise="";
        output = `
        <div class="card col-md mt-4 order-md-1 sticky-top">
                  <h4 class="mb-3 mt-3">User: ${response.user.firstname} ${response.user.lastname}</h4>
                      <div class=" mb-3">
                          <p>Email:${response.user.email}</p>
                      </div>
                      <div class="mb-3">
                          <p>Phone: ${response.user.phone} </p>
                      </div>
                          <div class="mb-3"><div id="useraccordion">`;
                        if(response.userplans.length!==0){
                          $.each(response.userplans,function(key,plan){
                              card_plan+=`<div class="card mb-3 mt-3">
                                <div class="card-header" id="plan_${plan.id}">
                                <h5 class="mb-0">
                                  <button class="btn btn-link" data-toggle="collapse" data-target="#plancollapse_${plan.id}" aria-expanded="true" aria-controls="collapse${plan.id}">
                                      Plan : ${plan.plan_name}
                                    </button>
                                  </h5>
                                </div>
                                <div id="plancollapse_${plan.id}" class="collapse " aria-labelledby="heading${plan.id}" data-parent="#useraccordion">
                                <div class="card-body">
                                <div class=" mb-3">
                                    <p>Difficulty: ${plan.plan_difficulty}</p>
                                </div>
                                <div class="mb-3">
                                    <p>Description: ${plan.plan_description} </p>
                                </div>
                                  <h5 class="card-title">Days</h5>`;
                                  if(plan.days.length!==0){
                                    card_day='';
                                    $.each(plan.days,function(key,day){
                                      card_day+=`<p class="card-text">Day ${day.order}: ${day.day_name}</p><hr class="mb-4">`;
                                      card_exercise="";
                                      if(day.exercise_instances.length){
                                        $.each(day.exercise_instances,function(key,exercise_instance){
                                          card_exercise+=`<p class="card-text">Exercise ${exercise_instance.order}: ${exercise_instance.exercise_name.exercise_name}</p>
                                                          <p class="card-text">Duration: ${exercise_instance.exercise_duration}</p>
                                                          <hr class="mb-4">`;
                                        })
                                      }else{
                                        card_exercise=`<div class="alert alert-danger" role="alert">
                                                    There is no exercises!
                                                  </div>`;
                                      }
                                      card_day+=card_exercise;
                                    });
                                  }else{
                                    card_day=`<div class="alert alert-danger" role="alert">
                                                There is no workout days!
                                              </div>`;
                                  }
                                  card_plan+=card_day+`</div></div>`;
                          });
                        }else{
                          card_plan=`<div class="alert alert-danger" role="alert">
                                      There is no plans assigned!
                                    </div>`;
                        }
        output+=card_plan+'</div></div>';

        $('#div_add_user').empty();
        $('#div_add_user').html(output);
      });
}

});//end
