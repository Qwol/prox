function getRndPass () {  
  return Math.random().toString(36).slice(2, 12);
}

function getRndLogin () {  
  return Math.random().toString().slice(2, 12);
}

function getTypeName (type) {
  switch (type) {
    case 'a':
      return 'ADMIN USERS';
      break;
    case 's':
      return 'PROXY USERS S';
      break;
    case 'm':
      return 'PROXY USERS M';
      break;
    case 'l':
      return 'PROXY USERS L';
      break;
    case 'xl':
      return 'PROXY USERS XL';
      break;
    case 't':
      return 'TEST USERS';
      break;
    default:
      return '';
  }
}

$(document).ready(function() {     
  var table = $('#main_table').DataTable({
    sDom: 'T<"clear ">lfrtip',
    paging: false,
    bInfo: false,
    scrollY: 400,
    aoColumnDefs: [
        { "sType": "numeric" }
    ],
    language: {
      zeroRecords: "Нет записей для отображения"
    },
    // columnDefs: [
    //   {
    //     "targets": [ 0 ],
    //     "visible": false,
    //     "searchable": false
    //   }
    // ],
    ajax: {
      url: JSON.parse(localStorage.getItem('isAll'))? "/rows?all=true": "/rows",              
      type: "GET",
      dataSrc: ""
    },
    columns: [
      { data: 'login' },
      { data: 'password' },
      { data: '_id' },
      { data: 'type',
        render: function ( data, type, row ) {
          var dispData = data;
          var sortData = data;
          switch (data) {
            case 'a':
              dispData = "Admin";
              sortData = "1";
              break;
            case 's':
              dispData = "Small";
              sortData = "2";
              break;                
            case 'm':
              dispData = "Medium";
              sortData = "3";
              break;  
            case 'l':
              dispData = "Large";
              sortData = "4";
              break;               
            case 'xl':
              dispData = "XLarge";
              sortData = "5";
              break;
            case 't':
              dispData = "Test";
              sortData = "6";
              break;                          
          }
          if ( type === 'display' || type === 'filter') return dispData;         
          else if (type === 'sort') return sortData;
          else return data;
        }
      },
      { data: 'status',
        render: function ( data, type, row ) {
          // If display or filter data is requested, format the status
          switch (data) {
            case 0:
              return "<span class='text-warning'>запас</span>";
              break;
            case 1:
              return "<span class='text-success'>готов</span>";
              break;                
            case 2:
              return "<span class='text-primary'>актив</span>";
              break;  
            case 3:
              return "<span class='text-danger'>истек</span>";
              break;    
            default:
              return data;           
          }
        }
      },
      { 
        data: 'end_date',
        render: function ( data, type, row ) {
          // If display or filter data is requested, format the date
          if ( type === 'display' || type === 'filter' ) {
              var d = data? moment(data).format("DD.MM.YYYY"): null;
              return d;
          }
          return data;
        }
      }
    ],
    order: [ 1, 'asc' ],
    tableTools: {
      sRowSelect: "os",
      sRowSelector: 'tr',
      aButtons: []
    }
  });

  var oTT = TableTools.fnGetInstance('main_table');

  table.on( 'draw', function () {
    oTT.fnSelectNone();
  });

  $('body').click(function (e) {
    if ($(e.target).prop("tagName") === 'BODY') oTT.fnSelectNone();
  });


  $('#selectall').click(function (event) {
    oTT.fnSelectNone();
    oTT.fnSelectAll(true);    
  });

  $('#deselectall').click(function (event) {
    oTT.fnSelectNone();    
  });

  if (JSON.parse(localStorage.getItem('isAll'))) $('.all-rows-checkbox').removeClass("glyphicon-unchecked").addClass("glyphicon-check");
  else $('.all-rows-checkbox').removeClass("glyphicon-check").addClass("glyphicon-unchecked");

  $('#showall').click(function (event) {    
    var chb = $(this).find('.all-rows-checkbox');   
    if ($(chb).hasClass("glyphicon-check")) {
      table.ajax.url("/rows").load();
      $(chb).removeClass("glyphicon-check").addClass("glyphicon-unchecked");
      localStorage.setItem('isAll', 'false');
    } else {
      table.ajax.url("/rows?all=true").load();
      $(chb).removeClass("glyphicon-unchecked").addClass("glyphicon-check");
      localStorage.setItem('isAll', 'true');
    }    
  });

  $("#searchbox").on("keyup search input paste cut", function() {
     table.search(this.value).draw();
  });  

  $('#myModal').on('hidden.bs.modal', function (event) {
    var modal = $(this);
    modal.find('.modal-title').text('');
    modal.find('.modal-body').html('');        
    modal.find('.modal-footer').html('');
  });

  $('#myModal').on('show.bs.modal', function (event) {
    var aData = oTT.fnGetSelectedData();
    var button = $(event.relatedTarget); // Button that triggered the modal
    var modalType = button.data('whatever'); // Extract info from data-* attributes
    var modal = $(this);

    switch (modalType) {
      case 'create':          
        var login = getRndLogin();
        var pass = getRndPass();
        var type = '';
        modal.find('.modal-title').text('Создание новой записи');
        modal.find('.modal-error').html('');
        modal.find('.modal-body').html('<form class="form-horizontal" id="create-form">' +
          '<div class="row">' +
            '<div class="form-group">' +
              '<label class="col-sm-2 control-label">Логин</label>'+
              '<div class="col-sm-8">' +
                '<input type="text" class="form-control auth-data" placeholder="Логин" disabled>' +
              '</div>' +
              '<div class="col-sm-2">' +
                '<a href="#"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a>' +
              '</div>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="col-sm-2 control-label">Пароль</label>'+
              '<div class="col-sm-8">' +
                '<input type="text" class="form-control auth-data" placeholder="Пароль" disabled>' +
              '</div>' +
              '<div class="col-sm-2">' +
                '<a href="#"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a>' +
              '</div>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="col-sm-2 control-label">Тип</label>'+ 
              '<div class="col-sm-4">' +             
                '<select class="form-control user-type">' +
                  '<option value=""></option>' +
                  '<option value="a">ADMIN USERS</option>' +
                  '<option value="s">PROXY USERS S</option>' +
                  '<option value="m">PROXY USERS M</option>' +
                  '<option value="l">PROXY USERS L</option>' +
                  '<option value="xl">PROXY USERS XL</option>' +
                  '<option value="t">TEST USERS</option>' +
                '</select>' +    
              '</div>' +
              '<div class="col-sm-4">' + 
                '<input type="ip" class="form-control" disabled placeholder="IP">' +
              '</div>' +
              '<div class="col-sm-2">' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</form>');        
        modal.find('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Чет я передумал, отбой.</button><button id="btn-create" type="button" class="btn btn-primary">Добавляем запись!</button>');

        if (aData.length === 1 && aData[0].status === 0) {
          type = aData[0].type;
          modal.find('.user-type option[value="' + type + '"]').prop('selected', true);
          modal.find('input[placeholder="IP"]').val(aData[0]._id).prop("disabled", true);
          modal.find('input[placeholder="Логин"]').val(type + login).change();
          modal.find('input[placeholder="Пароль"]').val(pass).change();
        }

        modal.find('input').change(function (event) {
          modal.find('.modal-error').html('');
        });

        modal.find(".col-sm-2 a").click(function (e) {
          if (type) {
            var currentInput = $(e.target.closest('.form-group')).find("input").first();
            if ($(currentInput).prop("placeholder") === "Логин") {
              login = getRndLogin();
              $(currentInput).val(type + login).change();
            } else if ($(currentInput).prop("placeholder") === "Пароль") {
              pass = getRndPass();
              $(currentInput).val(pass).change();
            }        
          }
        });

        modal.find('.user-type').change(function (event) {
          modal.find('.modal-error').html('');
          var select = $(this);
          type = $(event.target).find('option:selected').first().val();
          if (type) {
            if (type !== 'a') {
              var arr = modal.find('.auth-data').prop('disabled', true);
              $(arr[0]).val(type + login);
              $(arr[1]).val(pass);
            } else modal.find('.auth-data').val('').prop('disabled', false);

            $.ajax({
              url: "/freeip?type="+type,
              method: "GET",
            }).done(function (data) {           
              if (data._id) {
                modal.find('input[placeholder="IP"]').val(data._id).prop("disabled", true);
              } else {
                modal.find('input[placeholder="IP"]').val('').prop("disabled", false);
              }
            }).fail(function(jqXHR, textStatus, errorThrown) {
              modal.find('.modal-error').html('<div class="alert alert-danger" role="alert">' +
              '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
              '<span class="sr-only">Error:</span>' + jqXHR.responseText + '</div>');
            });
          } else {
            modal.find('.auth-data').val('').prop('disabled', true);
            modal.find('input[placeholder="IP"]').val('');
          }
        });

        $('#btn-create').click(function (event) {
          var login = modal.find('input[placeholder="Логин"]').first().val();
          var password = modal.find('input[placeholder="Пароль"]').first().val();
          var ip = modal.find('input[placeholder="IP"]').first().val();   
          var exist = modal.find('input[placeholder="IP"]').first().prop("disabled");
          
          if (type && login && password && ip) {
            modal.find('.modal-error').html('');

            var data = {
              login: login,
              password: password,
              ip: ip,
              type: type,
              exist: exist
            };
            
            $.ajax({
              url: "/rows",
              method: "POST",
              data: data
            }).done(function() {
              modal.modal('hide');
              table.ajax.reload();
            }).fail(function(jqXHR, textStatus, errorThrown) {
              modal.find('.modal-error').html('<div class="alert alert-danger" role="alert">' +
                '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                '<span class="sr-only">Error:</span>' + jqXHR.responseText + '</div>');
            });
          } else {
              modal.find('.modal-error').html('<div class="alert alert-danger" role="alert">' +
                '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                '<span class="sr-only">Error:</span>Все поля должны быть заполнены</div>');
          }
        }); 
      break;
      case 'edit':                
        modal.find('.modal-error').html('');
        modal.find('.modal-title').text('Редактирование');
        var type;
        var status;
        var date;
        var login;
        var pass;
        if (aData.length === 1) { //Реадктирование одной записи
          var id = aData[0]._id;
          type = aData[0].type;
          login = aData[0].login? aData[0].login: type + getRndLogin();
          pass = aData[0].password? aData[0].password: getRndPass();                   
          status = aData[0].status;
          date = aData[0].end_date;
          var disStatAuth = (type === 'a')? '': 'disabled';
          var disStatDate = (status === 2)? '': 'disabled';          
          modal.find('.modal-body').html('<form class="form-horizontal" id="edit-form">' +
            '<div class="row">' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Логин</label>'+
                '<div class="col-sm-8">' +
                  '<input type="text" class="form-control auth-data" placeholder="Логин" ' + disStatAuth + ' value="' + (aData[0].login? aData[0].login: "") + '">' +
                '</div>' +
                '<div class="col-sm-2">' +
                  '<a href="#"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Пароль</label>'+
                '<div class="col-sm-8">' +
                  '<input type="text" class="form-control auth-data" placeholder="Пароль" ' + disStatAuth + ' value="' + (aData[0].password? aData[0].password: "") + '">' +
                '</div>' +
                '<div class="col-sm-2">' +
                  '<a href="#"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a>' +
                '</div>' +
              '</div>' +

              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Тип</label>'+ 
                '<div class="col-sm-4">' + 
                  '<input type="text" class="form-control" placeholder="Тип" disabled value="' + getTypeName(type) + '">' +   
                '</div>' +
                '<div class="col-sm-4">' +    
                  '<input type="text" class="form-control" placeholder="IP" disabled value="' + id + '">' +                             
                '</div>' +
                '<div class="col-sm-2">' +
                '</div>' +
              '</div>' +

              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Статус</label>'+ 
                '<div class="col-sm-4">' + 
                  '<select class="form-control" placeholder="Статус">' +
                    '<option value="0">запас</option>' +
                    '<option value="1">готов</option>' +
                    '<option value="2">актив</option>' +
                    '<option value="3">истек</option>' +            
                  '</select>' +   
                '</div>' +
                '<div class="col-sm-4">' +    
                  // '<input type="date" min="' + moment(Date.now()).add(1, 'd').format("YYYY-MM-DD") + '" class="form-control" placeholder="Дата" value="' + (aData[0].end_date? moment(aData[0].end_date).format("YYYY-MM-DD"): "") + '" ' + disStatDate + '>' +                             
                  '<input type="date" class="form-control" placeholder="Дата" value="' + (aData[0].end_date? moment(aData[0].end_date).format("YYYY-MM-DD"): "") + '" ' + disStatDate + '>' +                                               
                '</div>' +
                '<div class="col-sm-2">' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</form>');        
          modal.find('option[value="' + status + '"]').prop('selected', true).change();
          modal.find('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Не, чет я погорячился.</button><button id="btn-edit" type="button" class="btn btn-primary">Меняем, я уверен!</button>');
          
          modal.find('input').change(function (event) {
            modal.find('.modal-error').html('');

          });

          modal.find(".col-sm-2 a").click(function (e) {            
            if (status == 1 || status == 2) {
              var currentInput = $(e.target.closest('.form-group')).find("input").first();
              if ($(currentInput).prop("placeholder") === "Логин") {
                login = type + getRndLogin();
                $(currentInput).val(login).change();
              } else if ($(currentInput).prop("placeholder") === "Пароль") {
                pass = getRndPass();
                $(currentInput).val(pass).change();
              }        
            }
          });

          modal.find('select[placeholder="Статус"]').change(function (event) {                       
            modal.find('.modal-error').html('');
            var select = $(this);
            status = parseInt($(event.target).find('option:selected').first().val());
            switch (status) {
              case 0:
                modal.find('input[placeholder="Логин"]').val('').prop("disabled", true);
                modal.find('input[placeholder="Пароль"]').val('').prop("disabled", true);
                modal.find('input[placeholder="Дата"]').val(null).prop("disabled", true);
                break;
              case 1:
                modal.find('input[placeholder="Логин"]').val(login).prop("disabled", (type != 'a'));
                modal.find('input[placeholder="Пароль"]').val(pass).prop("disabled", (type != 'a'));
                modal.find('input[placeholder="Дата"]').val(null).prop("disabled", true);
                break;
              case 2:
                modal.find('input[placeholder="Логин"]').val(login).prop("disabled", (type != 'a'));
                modal.find('input[placeholder="Пароль"]').val(pass).prop("disabled", (type != 'a'));
                modal.find('input[placeholder="Дата"]').val((date? moment(date).format("YYYY-MM-DD"): moment(Date.now()).add(1, 'M').format("YYYY-MM-DD"))).prop("disabled", false)
                break;
              case 3:
                modal.find('input[placeholder="Логин"]').val(login).prop("disabled", true);
                modal.find('input[placeholder="Пароль"]').val(pass).prop("disabled", true);
                modal.find('input[placeholder="Дата"]').val((date? moment(date).format("YYYY-MM-DD"): '')).prop("disabled", true)
                break;
            }
          });

          modal.find('input[placeholder="Дата"]').change(function (event) {   
            date = moment($(this).val()).valueOf();
          });

          $('#btn-edit').click(function (event) {
            modal.find('.modal-error').html('');           
            var clogin = modal.find('input[placeholder="Логин"]').val();
            var cpassword = modal.find('input[placeholder="Пароль"]').val();
            var cdate = modal.find('input[placeholder="Дата"]').val()? moment(modal.find('input[placeholder="Дата"]').val()).valueOf(): null;
            var data = {
              ip: id,
              login: clogin,
              password: cpassword,
              status: status,
              type: type,
              end_date: cdate 
            };
            $.ajax({
              url: "/row",
              method: "PUT",
              data: data
            }).done(function (d) {
              console.log(d);
              modal.modal('hide');
              table.ajax.reload();
            }).fail(function(jqXHR, textStatus, errorThrown) {              
              modal.find('.modal-error').html('<div class="alert alert-danger" role="alert">' +
              '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
              '<span class="sr-only">Error:</span>' + jqXHR.responseText + '</div>');
            });
          });           
        } else if (aData.length > 1) { //Множественное реадктирование
          var idArray = [];
          var statuses = [];
          aData.forEach(function (row) {
            if (!(statuses.indexOf(row.status) + 1))statuses.push(row.status);
            idArray.push(row._id);
          });
          if (statuses.length !== 1) {
            modal.find('.modal-body').html('Выделенные записи имеют разные статусы. Редактирование возможно лишь для записей с одинаковым статусом.');
            modal.find('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Ясно, понятно.</button>');
          } else {             
            var statStr = {
              0: '<option value="0">запас</option><option value="1">готов</option>',
              1: '<option value="1">готов</option><option value="2">актив</option>',
              2: '<option value="2">актив</option>',
              3: '<option value="1">готов</option><option value="3">истек</option>'
            };
            status = statuses[0];
            var disStatDate = (status === 2)? '': 'disabled';
            modal.find('.modal-body').html('<form class="form-horizontal" id="edit-form">' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Статус</label>'+ 
                '<div class="col-sm-4">' + 
                  '<select class="form-control" placeholder="Статус">' + statStr[status] + '</select>' +   
                '</div>' +
                '<div class="col-sm-4">' +    
                  '<input type="date" min="' + moment(Date.now()).add(1, 'd').format("YYYY-MM-DD") + '" class="form-control" placeholder="Дата" value="" ' + disStatDate + '>' +                             
                '</div>' +
                '<div class="col-sm-2">' +
                '</div>' +
              '</div>' +
            '</form>');
            modal.find('option[value="' + status + '"]').prop('selected', true).change();      
            modal.find('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Не, чет я погорячился.</button><button id="btn-edit" type="button" class="btn btn-primary">Меняем, я уверен!</button>');

            modal.find('select[placeholder="Статус"]').change(function (event) {                       
              modal.find('.modal-error').html('');
              var select = $(this);
              status = parseInt($(event.target).find('option:selected').first().val());
              switch (status) {
                case 2:
                  modal.find('input[placeholder="Дата"]').val((date? moment(date).format("YYYY-MM-DD"): moment(Date.now()).add(1, 'M').format("YYYY-MM-DD"))).prop("disabled", false);
                  break;
                default:
                  modal.find('input[placeholder="Дата"]').val(null).prop("disabled", true);
              }
            });

            modal.find('input[placeholder="Дата"]').change(function (event) {   
              date = moment($(this).val()).valueOf();
            });

            $('#btn-edit').click(function (event) {
              modal.find('.modal-error').text('');
              var cdate = modal.find('input[placeholder="Дата"]').val()? moment(modal.find('input[placeholder="Дата"]').val()).valueOf(): null;

              var data = {
                ips: idArray,
                status: status,
                base: statuses[0],
                end_date: cdate
              };

              $.ajax({
                url: "/rows",
                method: "PUT",
                data: data
              }).done(function() {
                modal.modal('hide');
                table.ajax.reload();
              }).fail(function(jqXHR, textStatus, errorThrown) {
                modal.find('.modal-error').html('<div class="alert alert-danger" role="alert">' +
                '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                '<span class="sr-only">Error:</span>' + jqXHR.responseText + '</div>');
              });
            });   
          }    
        } else {
          modal.find('.modal-body').html('Нечего редактировать. Ничего не выделено...');
          modal.find('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Ясно, понятно.</button>');
        }
      break;
      case 'delete':
        modal.find('.modal-title').text('Удаление');
        modal.find('.modal-error').text('');
        var ids = [];

        aData.forEach(function (item) {
          ids.push(item._id);
        });

        if (aData.length === 1) {
          modal.find('.modal-body').html('Братюнь, ты выделил одну запись. Уверен что нужно ее удалить?');        
          modal.find('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Не, чет я погорячился.</button><button id="btn-delete" type="button" class="btn btn-primary">Агась, удаляем к чертям!</button>');
        } else if (aData.length > 1 && aData.length < 5) {
          modal.find('.modal-body').html('Братюнь, ты выделил ' + aData.length + ' записи. Уверен что нужно их удалить?');        
          modal.find('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Не, чет я погорячился.</button><button id="btn-delete" type="button" class="btn btn-primary">Агась, удаляем все к чертям!</button>');
        } else if (aData.length >= 5) {
          modal.find('.modal-body').html('Братюнь, ты выделил ' + aData.length + ' записей. Уверен что нужно их удалить?');        
          modal.find('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Не, чет я погорячился.</button><button id="btn-delete" type="button" class="btn btn-primary">Агась, удаляем все к чертям!</button>');
        } else {
          modal.find('.modal-body').html('И что тут удалять? Ничего не выделено...');
          modal.find('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Ясно, понятно.</button>');
        }
        $('#btn-delete').click(function (event) {
          modal.find('.modal-error').text('');
          $.ajax({
            url: "/rows",
            method: "DELETE",
            data: {id: ids}
          }).done(function() {
            modal.modal('hide');
            table.ajax.reload();
          }).fail(function(jqXHR, textStatus, errorThrown) {
            modal.find('.modal-error').html('<div class="alert alert-danger" role="alert">' +
              '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
              '<span class="sr-only">Error:</span>' + jqXHR.responseText + '</div>');
          });
        });      
      break;
    }                 
  });
  
  $('#main_table_filter').addClass('form-group');
  $('#main_table_filter').find('label').addClass('control-label');
  $('#main_table_filter').find('input').addClass('form-control');
  
}); 