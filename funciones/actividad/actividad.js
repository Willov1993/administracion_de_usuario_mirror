var calendar;
var fechaActual = new Date().toJSON().slice(0, 10);
$(document).ready(function () {
     eventoActividades = function (start, end, timezone, callback) {
        var parametros = {'opcion': 'listaActividades'};
        $.ajax({
            type: 'POST',
            url: "funciones/actividad/actividadControlador.php",
            data: parametros,
            success: function (data) {
                var datos = [];

                if (data !== null || data !== '') {
                    if (data['data'] !== null && data['data'] !== '') {
                        for (var i = 0; i < data['data'].length; i++) {

                            datos.push({
                                id: data['data'][i]['id_actividad'],
                                title:  data['data'][i]['descripcion'],
                                start: moment(data['data'][i]['fecha_inicio']),
                                end: moment(data['data'][i]['fecha_fin']).add(1, "days"),
                                actividad:data['data'][i]['descripcion'],
                                allDay: true,
                                color: data['data'][i]['color'],
                                description:data['data'][i]['descripcion'] + "<br>" +
                                        "Fecha inicio: " + data['data'][i]['fecha_inicio'] + "<br>" +
                                        "Fecha fin: " + data['data'][i]['fecha_fin'] + "<br>" +
                                        'Total de dias: ' + (moment(data['data'][i]['fecha_fin']).diff(moment(data['data'][i]['fecha_inicio']), 'days') + 1)
                            });
                        }
                    }
                }
                callback(datos);
            }
        });
    }
    
    calendar = $('#calendar').fullCalendar({
        locale: 'es',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,listMonth'
        },
        views: {
            list: {
                listDayAltFormat: 'dddd',
            }
        },
        eventLimit: true,
        selectable: true,
        selectHelper: true,
        editable: true,
        eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
            $('#textEditActividad').text(event.title);
            $('#inicioEd').val(event.start.format('YYYY-MM-DD'));
            $('#finEd').val(event.end.subtract(1, "days").format('YYYY-MM-DD'));
            $('#id_actividad').val(event.id);
            $('#ModalEdit').modal('show');
        },
        eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
            $('#textEditActividad').text(event.title);
            $('#inicioEd').val(event.start.format('YYYY-MM-DD'));
            $('#finEd').val(event.end.subtract(1, "days").format('YYYY-MM-DD'));
            $('#id_actividad').val(event.id);
            $('#ModalEdit').modal('show');
        },
        events: eventoActividades,
        eventMouseover: function (calEvent, jsEvent) {
            var tooltip = '<div class="tooltipevent" style="width:420px;height:100px;padding-left:10px;padding-top:10px;color:white;background-color:' + calEvent.color + ';position:absolute;z-index:10001;">' + calEvent.description + '</div>';
            $("body").append(tooltip);
            $(this).mouseover(function (e) {
                $(this).css('z-index', 10000);
                $('.tooltipevent').fadeIn('500');
                $('.tooltipevent').fadeTo('10', 1.9);
            }).mousemove(function (e) {
                $('.tooltipevent').css('top', e.pageY + 10);
                $('.tooltipevent').css('left', e.pageX + 20);
            });
        },
        eventMouseout: function (calEvent, jsEvent) {
            $(this).css('z-index', 8);
            $('.tooltipevent').remove();
        },
        select: function (start, end) {
                var event = {'start': start, 'end': end, 'title': ''};
                llamarModalAdd(event);
        },
        eventClick: function (calEvent, jsEvent, view) {
            var event = {'id': calEvent.id, 'start': calEvent.start, 'end': calEvent.end, 'title': calEvent.title,'actividad':calEvent.actividad};
            llamarModalEdit(event);
        }
    });

    function llamarModalEdit(event) {
        $('#myModalLabel').text(event.title);
        $('#id_actividad').val(event.id);
        $('#descripcionActividad').val(event.actividad);
        $('#inicioEd').val(event.start.format('YYYY-MM-DD'));
        $('#finEd').val(event.end.subtract(1, "days").format('YYYY-MM-DD'));
        $('#ModalEdit').modal('show');
    }
    function llamarModalAdd(event) {
        $('#inicioAdd').val(event.start.format('YYYY-MM-DD'));
        $('#finAdd').val(event.end.subtract(1, "days").format('YYYY-MM-DD'));
        $('#ModalAdd').modal('show');
    }
    function refreshCalendarActividad() {
        calendar.fullCalendar('removeEventSource', eventoActividades);
        calendar.fullCalendar('addEventSource', eventoActividades);
        calendar.fullCalendar('refetchEventSources', eventoActividades);
        $('#ModalAdd,#ModalEdit').modal('hide');
    }

    $('#btnEditar').on('click', function () {
        $.ajax({
            type: 'POST',
            url: "funciones/actividad/actividadControlador.php",
            data: $('#formEditActividad').serialize(),
            success: function (data) {
                if (data['data']['tipo'] === "error") {
                    swal("", data['data']['texto'], data['data']['tipo']);
                } else {
                    swal("", data['data']['texto'], data['data']['tipo']);
                    refreshCalendarActividad();
                }
            },
            error: function (data) {
                alert("Ocurrió un error, intente más tarde.");
            }
        });
    });

    $('#btnAdd').on('click', function () {
        $.ajax({
            type: 'POST',
            url: "funciones/actividad/actividadControlador.php",
            data: $('#formAddActividad').serialize(), 
            success: function (data) {
                if (data['data']['tipo'] === "error") {
                    swal("", data['data']['texto'], data['data']['tipo']);
                } else {
                    swal("", data['data']['texto'], data['data']['tipo']);
                    refreshCalendarActividad();
                }
            },
            error: function (data) {
                alert("Ocurrió un error, intente más tarde.");
            }
        });
    });
    
    $('#btnBorrar').on('click', function () {
        var parametros = {'opcion': 'EliminarActividad', 'id_actividad': $('#id_actividad').val(), 'fecha_inicio': $('#inicioEd').val(), 'fecha_fin': $('#finEd').val()};
        $.ajax({
            type: 'POST',
            url: "funciones/actividad/actividadControlador.php",
            data: parametros,
            success: function (data) {
                if (data['data']['tipo'] === "error") {
                    swal("", data['data']['texto'], data['data']['tipo']);
                } else {
                    swal("", data['data']['texto'], data['data']['tipo']);
                    refreshCalendarActividad();
                }
            },
            error: function (data) {
                alert("Ocurrió un error, intente más tarde.");
            }
        });
    });

});
