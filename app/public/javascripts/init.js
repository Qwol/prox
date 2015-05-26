function getRndPass () {  
  return Math.random().toString(36).slice(2, 12);
}

function getRndLogin () {  
  return Math.random().toString().slice(2, 12);
}

$(document).ready(function() {     
  var table = $('#main_table').DataTable({
    sDom: 'T<"clear ">lfrtip',
    paging: false,
    bInfo: false,
    scrollY: 400,
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
      url: "/rows",              
      type: "GET",
      dataSrc: ""
    },
    columns: [
      { data: 'login' },
      { data: 'password' },
      { data: '_id' },
      { data: 'type' },
      { data: 'status',
        render: function ( data, type, row ) {
          // If display or filter data is requested, format the status
          switch (data) {
            case 0:
              return "<span class='text-danger'>запас</span>";
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
          }
          if ( type === 'display' || type === 'filter' ) {
              var d = moment(data);
              return d.format("DD.MM.YYYY (HH:mm)");
          }
          return data;
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

  $('#showall').click(function (event) {
    var chb = $(this).find('input');   
    if ($(chb).prop("checked")) {
      table.ajax.url("/rows").load();
      $(chb).prop("checked", false);
    } else {
      table.ajax.url("/rows?all=true").load();
      $(chb).prop("checked", true);
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
                  '<option value="">Выберите тип</option>' +
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
              '<span class="sr-only">Error:</span>' + errorThrown + '</div>');
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
        var type;
        var status;
        var date;
        if (aData.length === 1) {
          var login = '';
          var pass = '';
          type = aData[0].type;
          status = aData[0].status;
          date = aData[0].end_date;
          var disStatAuth = (type === 'a')? '': 'disabled';
          var disStatDate = (status === 2)? '': 'disabled';
          modal.find('.modal-title').text('Редактирование: ' + aData[0]._id + ' / "' + type + '"');
          modal.find('.modal-body').html('<form class="form-horizontal" id="edit-form">' +
            '<div class="row">' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Логин</label>'+
                '<div class="col-sm-8">' +
                  '<input type="text" class="form-control auth-data" placeholder="Логин" ' + disStatAuth + '>' +
                '</div>' +
                '<div class="col-sm-2">' +
                  '<a href="#"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Пароль</label>'+
                '<div class="col-sm-8">' +
                  '<input type="text" class="form-control auth-data" placeholder="Пароль" ' + disStatAuth + '>' +
                '</div>' +
                '<div class="col-sm-2">' +
                  '<a href="#"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Тип</label>'+ 
                '<div class="col-sm-4">' + 
                  '<select class="form-control" placeholder="Статус">' +
                    '<option value="0">запас</option>' +
                    '<option value="1">готов</option>' +
                    '<option value="2">актив</option>' +
                    '<option value="3">истек</option>' +            
                  '</select>' +   
                '</div>' +
                '<div class="col-sm-4">' +    
                  '<input type="date" class="form-control" placeholder="Дата" value="'+moment(aData[0].end_date).format("YYYY-MM-DD")+'" ' + disStatDate + '>' +                             
                '</div>' +
                '<div class="col-sm-2">' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</form>');        

          modal.find('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Не, чет я погорячился.</button><button id="btn-edit" type="button" class="btn btn-primary" data-id="' + aData[0]._id + '">Меняем, я уверен!</button>');
          
          modal.find('input').change(function (event) {
            modal.find('.modal-error').html('');
          });

          modal.find(".col-sm-2 a").click(function (e) {            
            if (status) {
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

          modal.find('select[placeholder="Статус"]').change(function (event) {                       
            modal.find('.modal-error').html('');
            var select = $(this);
            status = $(event.target).find('option:selected').first().val();
            if (status == 2) {
              modal.find('input[placeholder="Дата"]').val(date).prop("disabled", false);
            } else {
              modal.find('input[placeholder="Дата"]').val(null).prop("disabled", true);
            }
          });

          $('#btn-edit').click(function (event) {
            modal.find('.modal-error').text('');
            var id = $(this).data("id");
            var login = $('#edit-form').find('input')[0];
            var password = $('#edit-form').find('input')[1];
            var ip = $('#edit-form').find('input')[2];
            var status = $('#edit-form select option:selected');
            var end_date = $('#edit-form').find('input')[3];

            var data = {
              _id: id,
              login: $(login).val(),
              password: $(password).val(),
              ip: $(ip).val(),
              status: $(status).val(),
              end_date: $(end_date).val()? moment($(end_date).val()).valueOf(): null
            };
            
            $.ajax({
              url: "/rows",
              method: "PUT",
              data: data
            }).done(function() {
              modal.modal('hide');
              table.ajax.reload();
            }).fail(function(jqXHR, textStatus, errorThrown) {
              modal.find('.modal-error').text(textStatus);
            });
          });           
        } else if (aData.length > 1) {
          var idArray = [];
          for (i=0; i < aData.length; i++) {
            idArray.push(aData[i]._id);
          }
          modal.find('.modal-body').html('<form id="edit-form">' +
          '<div class="row">' +
          '<div class="col-xs-6">' +
          '<div class="form-group">' +
          '<select class="form-control" placeholder="Статус">' +
            '<option value=""></option>' +
            '<option value="0">запас</option>' +
            '<option value="1">готов</option>' +
            '<option value="2">актив</option>' +
            '<option value="3">истек</option>' +            
          '</select>' +  
          '</div>' +
          '</div>' +
          '<div class="col-xs-6">' +
          '<div class="form-group">' +
          '<input type="date" disabled class="form-control" placeholder="Дата" value="'+moment(aData[0].end_date).format("YYYY-MM-DD")+'">' +                          
          '</div>' +
          '</div>' +
          '</div>'+
          '</form>');       
          modal.find('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Не, чет я погорячился.</button><button id="btn-edit" type="button" class="btn btn-primary">Меняем, я уверен!</button>');

          modal.find('.modal-body select').change(function () {
            $( ".modal-body select option:selected" ).each(function() {
              if ($( this ).val() == 2) {
                $( "input[type='date']" ).prop('disabled', false);
              } else {
                $( "input[type='date']" ).prop('disabled', true).val(moment(null));

              }
            });
          });

          $('#btn-edit').click(function (event) {
            modal.find('.modal-error').text('');
            var status = $('#edit-form select option:selected');
            var end_date = $('#edit-form').find("input[type='date']");

            var data = {
              _id: idArray,
              status: $(status).val()? $(status).val(): undefined,
              end_date: $(end_date).val()? moment($(end_date).val()).valueOf(): null
            };

            $.ajax({
              url: "/rows",
              method: "PUT",
              data: data
            }).done(function() {
              modal.modal('hide');
              table.ajax.reload();
            }).fail(function(jqXHR, textStatus, errorThrown) {
              modal.find('.modal-error').text(textStatus);
            });
          });        
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
              '<span class="sr-only">Error:</span>' + errorThrown + '</div>');
          });
        });      
      break;
    }                 
  });
  
  $('#main_table_filter').addClass('form-group');
  $('#main_table_filter').find('label').addClass('control-label');
  $('#main_table_filter').find('input').addClass('form-control');
  
}); 