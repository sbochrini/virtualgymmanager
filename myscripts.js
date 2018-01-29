  $(document).ready(function(){
    getPlans();

    // Get items from API
    function getPlans(){
      $.ajax({
        url:'/virtuagymapi/public/api/plans'
      }).done(function(response){
        var output = '';
        var difficulty_dropdown = '';
        var exercise_dropdown = '';

         $.each(response.difficulty_levels, function(key, level){
               difficulty_dropdown += `<option value="${level.id}">${level.level_name}</option>`;
         });
         $.each(response.exercises, function(key, exercise){
                 exercise_dropdown += `<option value="${exercise.id}">${exercise.exercise_name}</option>`;
          });
        $.each(response.plans, function(key, plan){
          output += `
          <li class="list-group-item mb-1">
                          <div class="row">
                              <div class="col-md-auto">
                                  <img src="/virtuagymapi/public/gym.png" style="height: 117px; width: 117px;">
                              </div>
                              <div class="col">
                                  <div class="row">
                                      <div class="col">
                                          <div id="plan_cardtitle_${plan.id}" class="card-title">${plan.plan_name}</div>
                                      </div>
                                      <div class="col">
                                          <div class="row mb-3">
                                              <div class="col">
                                                  <button class="editPlan btn btn-outline-dark btn-sm" data-id="${plan.id}"><i class="far fa-edit"></i>Edit</button>
                                              </div>
                                              <div class="col">
                                                  <button class="showPlan btn btn-outline-info btn-sm" data-id="${plan.id}"><i class="fas fa-eye"></i>View</button>
                                              </div>
                                          </div>
                                          <div class="row">
                                              <div class="col">
                                                  <button class="deleteLink btn btn-outline-danger btn-sm" data-id="${plan.id}"><i class="far fa-trash-alt"></i> Delete</button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="row">
                                      <div class="col">
                                          <a data-toggle="collapse" href="#plan_collapse${plan.id}" role="button" aria-expanded="false" aria-controls="plan_collapse${plan.id}">
                                              <small>Info</small>
                                          </a>
                                          <div class="collapse" id="plan_collapse${plan.id}">
                                              <div class="card">
                                                  <div class="card-body">
                                                      <p class="card-text" id="p_plan_difficulty_${plan.id}"><small>Difficulty: ${plan.plan_difficulty}</small></p>
                                                      <p class="card-text" id="p_plan_description_${plan.id}"><small>Description: ${plan.plan_description}</small></p>
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
        $('#plans').append(output);
        $( exercise_dropdown ).appendTo( ".exercises_select" );
        $('#plan_dificulty').append(difficulty_dropdown);
        // $('#exercises_select').append(exercise_dropdown);
      });
    }

    //add new plan form
    $('#btn_add_plan').on('click', function(){
      $.ajax({
        url:'/virtuagymapi/public/api/addplanform'
      }).done(function(response){
        let difficulty_dropdown = '';
        let exercise_dropdown = '';
        let output = '';

         $.each(response.difficulty_levels, function(key, level){
               difficulty_dropdown += `<option value="${level.id}">${level.level_name}</option>`;
         });
         $.each(response.exercises, function(key, exercise){
                 exercise_dropdown += `<option value="${exercise.id}">${exercise.exercise_name}</option>`;
          });
        //console.log(response.difficulty_levels);
          output += `
          <div class="card col-md mt-4 order-md-1">
                    <h4 class="mb-3 mt-3">Workout Editor</h4>
                    <form  id="form_addplan" method="post" class="planForm needs-validation" data-id="" novalidate>
                      <div id="divforedit">

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="plan_name">Workout Name</label>
                                    <input type="text" class="form-control" id="plan_name" name="plan_name" required>
                                    <div id="invalid_planname" class="invalid-feedback">

                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="plan_dificulty">Difficulty</label>
                                    <select name="plan_difficulty" class="form-control" id="plan_dificulty" required>
                                        <option value="">Choose...</option>
                                        `+difficulty_dropdown+`

                                    </select>
                                    <div id="invalid_plandifficulty" class="invalid-feedback">

                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="plan_description">Description</label>
                                <textarea id="plan_description" type="text" class="form-control" name="plan_description"></textarea>
                                <div class="invalid-feedback">

                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md mb-3">
                                    <div class="card" style="min-height: 18rem;">
                                        <div class="card-header">
                                        <div class=row>
                                            <div class="col-md-10">
                                              Workout plan days
                                            </div>
                                            <div class="col-md-2">
                                              <div class=row>
                                                <button id="btn_addplanday" onclick="addPlanday()" class="btn btn-link btn-sm float-right" type="button"><i class="fa fa-plus fa-sm"></i><small> Add</small></button>
                                              </div>
                                              <div class=row>
                                                <button type="button" class="btn btn-link btn-sm float-right" onclick="deleteDay()"><i class="far fa-trash-alt fa-sm"></i><small> Delete</small></button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="card-body">
                                            <ul id="ul_addplanday" class="list-group list-group-flush">
                                              <li id="li_1" class="list-group-item">
                                                  <div class="form-group row">
                                                  <input type="text" hidden name="days[1][day_order]" value="1">
                                                  <label class="col-md-2 col-form-label">Day 1</label>
                                                  <div class="col-md-6">
                                                      <input id="day_1" name="days[1][day_name]" type="text" class="day_name form-control" placeholder=" Name" data-dayorder="1">
                                                  </div>

                                                  <div class="col-md-3">
                                                      <a id="btn_addexercises" data-toggle="collapse" href="#planday_collapse_1" role="button" aria-expanded="false" aria-controls="planday_collapse_1">
                                                          <i class="fa fa-chevron-down fa-sm"></i><small> Exercises</small>
                                                      </a>
                                                  </div>
                                                  </div>
                                              </li>
                                              <div class="collapse show" id="planday_collapse_1">
                                                  <div class="card">
                                                  <div class="card-body">
                                                      <div class="col mb-3">
                                                          <button id="btn_addexercise_day_1" onclick="addExercise(this.id)" class="btn_addexercise btn btn-link btn-sm" type="button"><i class="fa fa-plus fa-sm"></i><small> Add exercise</small></button>
                                                      </div>
                                                      <div class="exercise_container_1">
                                                          <input type="text" hidden name="days[1][exercises][1][exercise_order]" value="1">
                                                          <div class="form-group row mb-3">
                                                              <label class="col-md-3 col-form-label form-control-sm" for="days[][exercises][1][exercise_id]">Exercise</label>
                                                              <div class="col-md-9">
                                                                  <select  name="days[1][exercises][1][exercise_id]" class="exercises_select form-control form-control-sm">
                                                                    <option value="">Choose...</option>
                                                                      `+exercise_dropdown+`

                                                                  </select>
                                                              </div>
                                                          </div>
                                                          <div class="form-group row mb-3">
                                                              <label class="col-md-3 col-form-label form-control-sm" for="days[1][[exercises][exercise_duration]">Duration</label>
                                                              <div class="col-md-9">
                                                                  <input id="exercise_duration" type="text" class="form-control form-control-sm" name="days[1][exercises][1][exercise_duration]"  required>
                                                              </div>
                                                              <div class="invalid-feedback" id="invalid_exerciseduration">

                                                              </div>
                                                          </div>
                                                          <hr class="mb-4">
                                                      </div>
                                                  </div>
                                                  </div>
                                                  </div>
                                                  <!-- append days -->
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="col-md mb-3">
                            <input class="btn btn-success" id="btn_submit_plan" value="Save" type="button" data-form="add" onclick="storePlan()"></input>
                        </div>
                        <hr class="mb-4">
                    </form>
                </div>
          <hr>
          `;
        $('#div_add_plan').empty();
        $('#div_add_plan').append(output);
      });
    });

    // Delete event
    $('body').on('click', '.deleteLink', function(e){
      e.preventDefault();

      let id = $(this).data('id');

      deletePlan(id);
    });

    // Delete item through api
    function deletePlan(id){
      $.ajax({
        method:'POST',
        url:'/virtuagymapi/public/api/plans/'+id,
        data: {_method: 'DELETE'}
      }).done(function(plan){
        alert('Plan deleted');
        location.reload();
      });
    }



    $('body').on('click', '.editPlan', function(e){
      e.preventDefault();

      let id = $(this).data('id');

      editPlan(id);
    });

    function editPlan(id){
      $.ajax({
        method:'GET',
        url:'/virtuagymapi/public/api/plans/'+id+'/edit',
      }).done(function(response){
        // $('.planForm').attr("id","form_edituser");
        // $('.planForm').data("id",response.plan.id);
        // $('.planForm').attr("method","PUT");
        // $('#btn_submit_plan').data('form',"edit");
          var difficulty_dropdown = '';
          var exercise_dropdown = '';
          var exercise_dropdown_forempty='';
          var output = '';
          var days_li ='';
          var duration_html='';
          var exercise_html='';
          $.each(response.exercises, function(key, exercise){
              exercise_dropdown_forempty += `<option value="${exercise.id}">${exercise.exercise_name}</option>`;
          });
         $.each(response.difficulty_levels, function(key, level){
           if(level.id==response.plan.plan_difficulty){
                   difficulty_dropdown += `<option value="${level.id}" selected>${level.level_name}</option>`;
           }else{
                 difficulty_dropdown += `<option value="${level.id}">${level.level_name}</option>`;
           }
         });

          if (response.plan.days.length !== 0) {
              $.each(response.plan.days,function(key,day){
                  if ( day.exercise_instances.length !== 0) {
                      $.each(day.exercise_instances, function(key, exercise_instance){
                          exercise_html+=`<input type="text" hidden name="days[${day.order}][exercises][${exercise_instance.order}][exercise_order]" value="${exercise_instance.order}">
                                <div class="form-group row mb-3">
                                    <label class="col-md-3 col-form-label form-control-sm" for="days[${day.order}][exercises][${exercise_instance.order}][exercise_id]">Exercise</label>
                                    <div class="col-md-9">
                                        <select name="days[${day.order}][exercises][${exercise_instance.order}][exercise_id]" class="form-control form-control-sm">
                                            <option value="">Choose...</option>`;
                                          $.each(response.exercises, function(key, exercise){
                                              if(exercise.id==exercise_instance.exercise_id){
                                                  exercise_dropdown += `<option value="${exercise.id}" selected>${exercise.exercise_name}</option>`;
                                              }else{
                                                  exercise_dropdown += `<option value="${exercise.id}">${exercise.exercise_name}</option>`;
                                              }
                                              duration_html=`</select>
                                                          </div>
                                                      </div>
                                                      <div class="form-group row mb-3">
                                                          <label class="col-md-3 col-form-label form-control-sm" for="days[${day.order}][exercises][${exercise_instance.order}][exercise_duration]">Duration</label>
                                                          <div class="col-md-9">
                                                              <input id="plan_difficulty" type="text" class="form-control form-control-sm" name="days[${day.order}][exercises][${exercise_instance.order}][exercise_duration]" value="${exercise_instance.exercise_duration}" >
                                                          </div>
                                                          <div class="invalid-feedback" id="invalid_plandifficulty">

                                                          </div>
                                                      </div>
                                                      <hr class="mb-4">`;
                                          });
                                          exercise_html += exercise_dropdown+duration_html;
                                        //  exercise_html += ``;

                      });
                  }else{
                      exercise_html=`<input type="text" hidden name="days[1][exercises][1][exercise_order]" value="1">
                                                              <div class="form-group row mb-3">
                                                                  <label class="col-md-3 col-form-label form-control-sm" for="days[][exercises][1][exercise_id]">Exercise</label>
                                                                  <div class="col-md-9">
                                                                      <select  name="days[1][exercises][1][exercise_id]" class="exercises_select form-control form-control-sm">
                                                                        <option value="">Choose...</option>
                                                                          `+exercise_dropdown_forempty+`

                                                                      </select>
                                                                  </div>
                                                              </div>
                                                              <div class="form-group row mb-3">
                                                                  <label class="col-md-3 col-form-label form-control-sm" for="days[1][[exercises][exercise_duration]">Duration</label>
                                                                  <div class="col-md-9">
                                                                      <input id="exercise_duration" type="text" class="form-control form-control-sm" name="days[1][exercises][1][exercise_duration]"  required>
                                                                  </div>
                                                                  <div class="invalid-feedback" id="invalid_exerciseduration">

                                                                  </div>
                                                              </div>
                                                              <hr class="mb-4">`;
                  }

                  //});

                  days_li +=`<li id="li_${day.order}" class="list-group-item">
                        <div class="form-group row">
                        <input type="text" hidden name="days[${day.order}][day_order]" value="${day.order}">
                        <label class="col-md-2 col-form-label">Day ${day.order} </label>
                        <div class="col-md-6">
                            <input id="day_1" name="days[${day.order}][day_name]" type="text" class="form-control" value="${day.day_name}">
                        </div>
                        <div class="col-md-3">
                            <a id="btn_addexercises" data-toggle="collapse" href="#planday_collapse_${day.order}" role="button" aria-expanded="false" aria-controls="planday_collapse_${day.order}">
                                <i class="fa fa-chevron-down fa-sm"></i><small> Exercises</small>
                            </a>
                        </div>
                        </div>
                    </li>
                    <div class="collapse show" id="planday_collapse_${day.order}">
                        <div class="card">
                        <div class="card-body">
                            <div class="col mb-3">
                                <button id="btn_addexercise_day_${day.order}"  onclick="addExercise(this.id)" class="btn_addexercise btn btn-link btn-sm" type="button"><i class="fa fa-plus fa-sm"></i><small> Add exercise</small></button>
                            </div>
                            <div class="exercise_container_${day.order}">
                                <input type="text" hidden name="days[1][exercises][1][exercise_order]" value="1">
                                                              <div class="form-group row mb-3">
                                                                  <label class="col-md-3 col-form-label form-control-sm" for="days[][exercises][1][exercise_id]">Exercise</label>
                                                                  <div class="col-md-9">
                                                                      <select  name="days[1][exercises][1][exercise_id]" class="exercises_select form-control form-control-sm">
                                                                        <option value="">Choose...</option>
                                                                          `+exercise_dropdown_forempty +`
                                                                          </select>
                                                                                      </div>
                                                                                  </div>
                                                                                  <div class="form-group row mb-3">
                                                                                      <label class="col-md-3 col-form-label form-control-sm" for="days[1][exercises][1][exercise_duration]">Duration</label>
                                                                                      <div class="col-md-9">
                                                                                          <input id="exercise_duration" type="text" class="form-control form-control-sm" name="days[1][exercises][1][exercise_duration]" value="" >
                                                                                      </div>
                                                                                      <div class="invalid-feedback" id="invalid_exerciseduration">

                                                                                      </div>
                                                                                  </div>
                                                                                  <hr class="mb-4">


                            </div>
                        </div>
                        </div>
                        </div>`;
              });
          }else{
              days_li=`<li id="li_1" class="list-group-item">
                                                      <div class="form-group row">
                                                      <input type="text" hidden name="days[1][day_order]" value="1">
                                                      <label class="col-md-2 col-form-label">Day 1</label>
                                                      <div class="col-md-6">
                                                          <input id="day_1" name="days[1][day_name]" type="text" class="day_name form-control" placeholder=" Name" data-dayorder="1">
                                                      </div>
                                                      <div class="col-md-3">
                                                          <a id="btn_addexercises" data-toggle="collapse" href="#planday_collapse_1" role="button" aria-expanded="false" aria-controls="planday_collapse_1">
                                                              <i class="fa fa-chevron-down fa-sm"></i><small> Exercises</small>
                                                          </a>
                                                      </div>
                                                      </div>
                                                  </li>
                                                  <div class="collapse show" id="planday_collapse_1">
                                                      <div class="card">
                                                      <div class="card-body">
                                                          <div class="col mb-3">
                                                              <button id="btn_addexercise_day_1" onclick="addExercise(this.id)" class="btn_addexercise btn btn-link btn-sm" type="button"><i class="fa fa-plus fa-sm"></i><small> Add exercise</small></button>
                                                          </div>
                                                          <div class="exercise_container_1">
                                                              <input type="text" hidden name="days[1][exercises][1][exercise_order]" value="1">
                                                              <div class="form-group row mb-3">
                                                                  <label class="col-md-3 col-form-label form-control-sm" for="days[1][exercises][1][exercise_id]">Exercise</label>
                                                                  <div class="col-md-9">
                                                                      <select  name="days[1][exercises][1][exercise_id]" class="exercises_select form-control form-control-sm">
                                                                        <option value="">Choose...</option>
                                                                          `+ exercise_dropdown_forempty+`

                                                                      </select>
                                                                  </div>
                                                              </div>
                                                              <div class="form-group row mb-3">
                                                                  <label class="col-md-3 col-form-label form-control-sm" for="days[1][[exercises][exercise_duration]">Duration</label>
                                                                  <div class="col-md-9">
                                                                      <input id="exercise_duration" type="text" class="form-control form-control-sm" name="days[1][exercises][1][exercise_duration]"  required>
                                                                  </div>
                                                                  <div class="invalid-feedback" id="invalid_exerciseduration">

                                                                  </div>
                                                              </div>
                                                              <hr class="mb-4">
                                                          </div>
                                                      </div>
                                                      </div>
                                                      </div>`;
          }

        //console.log(response.difficulty_levels);
          output += `
          <div class="card col-md mt-4 order-md-1">
                    <h4 class="mb-3 mt-3">Workout: ${response.plan.plan_name}</h4>
                    <form  id="form_editplan" method="put" class="planForm" data-id="${response.plan.id}">
                    <div id="divforedit">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="plan_name">Workout Name</label>
                                <input type="text" class="form-control" id="plan_name" name="plan_name" value="${response.plan.plan_name}" required>
                                <div class="invalid-feedback" id="invalid_planname">

                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="plan_dificulty">Difficulty</label>
                                <select name="plan_difficulty" class="form-control" id="plan_dificulty" required>
                                <option value="">Choose...</option>
                                    `+difficulty_dropdown+`
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="plan_description">Description</label>
                            <textarea id="plan_description" type="text" class="form-control" name="plan_description">${response.plan.plan_description}</textarea>
                            <div class="invalid-feedback">
                                Description is required.
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md mb-3">
                                <div class="card" style="min-height: 18rem;">
                                    <div class="card-header">
                                      <div class=row>
                                          <div class="col-md-10">
                                            Workout plan days
                                          </div>
                                          <div class="col-md-2">
                                            <div class=row>
                                              <button id="btn_addplanday" onclick="addPlanday()" class="btn btn-link btn-sm float-right" type="button"><i class="fa fa-plus fa-sm"></i><small> Add</small></button>
                                            </div>
                                            <div class=row>
                                              <button type="button" class="btn btn-link btn-sm float-right" onclick="deleteDay()"><i class="far fa-trash-alt fa-sm"></i><small> Delete</small></button>
                                            </div>
                                          </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                          <ul id="ul_addplanday" class="list-group list-group-flush">
                                            `+days_li+`
                                          </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div class="col-md mb-3">
                            <input class="btn btn-success" id="btn_edit_plan" value="Save" type="button" data-form="add" onclick="updatePlan()"></input>
                        </div>
                        <hr class="mb-4">
                    </form>
                </div>
          <hr>
          `;
        $('#div_add_plan').empty();
        $('#div_add_plan').append(output);
      });
    }

    $('body').on('click', '.showPlan', function(e){
      e.preventDefault();

      let id = $(this).data('id');

      showPlan(id);
    });

    function showPlan(id){
      $.ajax({
        method:'GET',
        url:'/virtuagymapi/public/api/plans/'+id,
        data: {_method: 'GET'}
      }).done(function(response){
        card_day="";
        exercises="";
        output = `
        <div class="card col-md mt-4 order-md-1 sticky-top">
                  <h4 class="mb-3 mt-3">Workout: ${response.plan.plan_name}</h4>
                      <div class=" mb-3">
                          <p>Difficulty:${response.plan.difficulty.level_name}</p>
                        </div>
                        <div class="mb-3">
                            <p>Description: ${response.plan.plan_description} </p>
                          </div>
                          <div class="mb-3"><div id="planaccordion">`;
                          if(response.plan.days.length>0){
                            card_day="";
                            $.each(response.plan.days,function(key,day){
                              card_day+=`<div class="card">
                                <div class="card-header" id="planday_${day.id}">
                                <h5 class="mb-0">
                                  <button class="btn btn-link" data-toggle="collapse" data-target="#plandaycollapse_${day.id}" aria-expanded="true" aria-controls="collapse${day.id}">
                                      Day ${day.order}: ${day.day_name}
                                  </button>
                                </h5>
                                </div>
                                <div id="plandaycollapse_${day.id}" class="collapse show" aria-labelledby="heading${day.id}" data-parent="#planaccordion">
                                <div class="card-body">
                                  <h5 class="card-title">Exercises</h5>`;
                                  if(day.exercise_instances.length>0){
                                    exercise='';
                                    $.each(day.exercise_instances,function(key,exercise){
                                      exercises+=`<p class="card-text">Exercise ${exercise.order}: ${exercise.exercise_name.exercise_name}</p>
                                                  <p class="card-text">Duration: ${exercise.exercise_duration}</p>
                                                  <hr class="mb-4">`;
                                    });
                                  }else{
                                    exercises=`<div class="alert alert-danger" role="alert">
                                                There is no exercises!
                                              </div>`;
                                  }
                                  card_day+=exercises+`</div></div>`;
                            });
                          }else {
                            card_day=`<div class="alert alert-danger" role="alert">
                                        There is no days!
                                      </div>`;
                          }

        output+=card_day+'</div></div>';

        $('#div_add_plan').empty();
        $('#div_add_plan').append(output);
      });
    }
  });
