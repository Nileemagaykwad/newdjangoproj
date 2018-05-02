//function that displaying data from the checked boxes :
$(document).ready(function () {
    $('#annotation').on('click', function () {

        window.location.replace('/annotation');


    });
});

//function for species id list
$('#accessSpeciesDD').change(function (event) {
    $('#accessReferencegenomeDD').show();
    $('#accessReferencegenomeDD').css('visibility', 'visible'); //once the species ID selected
    var text = event.target.options[$('#accessSpeciesDD').val()].textContent;
    $('#speciesDD').val(text);
})


//function for the 1st dropdownlist
$(document).ready(function () {


    // check if the 1st dropdown clicked or not
    if (parseInt($('#accessSpeciesDD').val())) {
        $('#accessReferencegenomeDD').css('visibility', 'visible');  //if the species selected referencegenome list visible
        $('#accessReferencegenomeDD').show();
    } else {
        $('#accessReferencegenomeDD').show();
        $('#accessReferencegenomeDD').css('visibility', 'hidden');      //else the referencegenonme list hidden
    }

    //function for selecting 2nd input and trigger the popup window
    $(document).ready(function () {
        $("#accessReferencegenomeDD").change(function (ev) {
            popup(ev.target.value);
        });
    });


    //widget configuration
    var config = {
        layout: {
            name: 'layout',
            padding: 4,
            panels: [
                {type: 'center', size: '50%', resizable: true, minSize: 300},
                {type: 'main', minSize: 300}
            ]
        },


        grid: {
            name: 'grid',

            onClick: function (event) {
                var grid = this;
                var form = w2ui.form;
                event.onComplete = function () {
                    var sel = grid.getSelection();
                    if (sel.length == 1) {
                        form.recid = sel[0];
                        form.record = $.extend(true, {}, grid.get(sel[0]));
                        form.refresh();
                    } else {
                        form.clear();
                    }
                }
            }
        },

    };


    $(function () {

         //function when click "Done" button of Popup
        window.saveData = function(val) {
            var gridId = 'annotationGrid';
            var phenotypeGridId = 'phenotypeGrid';
            var selectedData = w2ui[gridId].getSelection();
            var tmp = [];
            var tmpPhonetype = [];
            var type = 'annotation';

            // get selected data from Annotation grid
           for (var idx in selectedData) {
                var arr = w2ui[gridId].records;
                arr.map((item, index) => {
                    if (item.recid == selectedData[idx]) {
                        tmp.push(item['Column_name']);
                    }
                })

            }

            selectedData = w2ui[phenotypeGridId].getSelection();

            // get selected data from Phenotype grid
            for (var idx in selectedData) {
                var arr = w2ui[phenotypeGridId].records;
                arr.map((item, index) => {
                    if (item.recid == selectedData[idx]) {
                        tmpPhonetype.push(item['Column_name']);
                    }
                })
            }

            if (w2ui[gridId].getSelection().length == 0) {
                window.alert('You must import annotype data');
                $.ajax({
                    type: "POST",
                    url: '/save_session',
                    data: {
                        'selected_annotation_columns': JSON.stringify([]),
                        'selected_phenotype_columns': JSON.stringify([])
                    },
                    success: function(res) {

                    },
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: '/save_session',
                    data: {
                    'selected_annotation_columns': JSON.stringify(tmp),
                    'selected_phenotype_columns': JSON.stringify(tmpPhonetype),
                    'type': type
                    },
                    success: function(res) {
                    },
                });
            }

            w2popup.close();
        }

        // function when click "Close" button of Popup
        window.cancelPopup = function(val) {
            var gridId = 'annotationGrid';
            var phenotypeGridId = 'phenotypeGrid';
            var data = ["v3 gene model"];
            window.alert('I am wondering if you are selecting/saving nothing');
            //display GeneId when user click "close"
            if (val == "2" || val == "3") {
                data = ['v4 gene model'];
            }
            $.ajax({
                type: "POST",
                url: '/save_session',
                data: {
                    'selected_annotation_columns': JSON.stringify(data),
                    'selected_phenotype_columns': JSON.stringify([])
                },
                success: function(res) {

                },
            });

            w2popup.close();
        }

        //annotation grid
        $().w2grid({
           name   : 'annotationGrid',
           header: 'List of Names',
           method: 'GET',
           show: {
               toolbar: false,
               selectColumn: true
           },
           multiSelect: true,
           columns: [


               { field: 'Column_name', caption: 'Column name', size: '120px', sortable: true,  },
                { field: 'Created_by', caption: 'Created By', size: '30%', sortable: true },
                { field: 'Created_time', caption: 'Created Time', size: '40%', sortable: true },
                { field: 'Description', caption: 'Description', size: '120px', sortable: true },
                { field: 'Source', caption: 'Source', size: '120px', sortable: true },


            ],

           onRender: function (event) {

                actionAnnotation();

            },
            //event for can't unselect the GeneId checkbox
           onUnselect: function(event) {
                if (event.hasOwnProperty('all')) {

                } else {
                    if ($(this)[0].get(event.recid)['Column_name'].indexOf('gene model') > -1) {
                        event.preventDefault();
                    } else {

                    }
                }

               event.onComplete = function() {
                    if (event.hasOwnProperty('all')) {
                        var records = $(this)[0].records;
                        records.map((record, idx) => {
                            if (record['Column_name'].indexOf('gene model') > -1) {
                                $(this)[0].select(idx);
                            }
                        })
                    }
                }

            }
        });

        // phenotype grid
        $().w2grid({
            name   : 'phenotypeGrid',
            header: 'List of Names',
            method: 'GET',
            show: {
                toolbar: false,
                selectColumn: true
            },
            multiSelect: true,
            columns: [



                 { field: 'Column_name', caption: 'Column name', size: '120px', sortable: true },
                 { field: 'Created_by', caption: 'Created By', size: '30%', sortable: true },
                 { field: 'Created_time', caption: 'Created Time', size: '40%', sortable: true },
                 { field: 'Description', caption: 'Description', size: '120px', sortable: true },
                 { field: 'Source', caption: 'Source', size: '120px', sortable: true },
             ],

              onRender: function (event) {

                actionPhenotype();
            },
         })
    });


    //function for annotation grid
    function actionAnnotation() {

        var gridId = 'annotationGrid';
        var url = '';
        var num = window.versionVal;
        //if user select 1st v3 referencegenome
        if (num == '1') {
            url = 'v3_annotation_columns';

        } else {
            url = 'v4_annotation_columns';

        }
        w2ui[gridId].load(url, function (res) {
            // select first column after loading data
            w2ui[gridId].select(0);
        });
    }

    // function for phenotype grid
    function actionPhenotype() {

        var gridId = 'phenotypeGrid';


        w2ui[gridId].load('phenotype', function (res) {
        })
    }

    //function for the popup window
    function popup(nameVal) {
        window.versionVal = nameVal;
        var tempName = Math.random().toString(36).substring(7);
        var obj = w2popup.open({
            name: tempName,
            title: 'Popup Title',
            buttons: '<button class="w2ui-btn" onclick="window.cancelPopup(' + '\'' + nameVal + '\'' + ')">Close</button> ' +  //close the window without saved the selected columns
            '<button class="w2ui-btn" onclick="window.saveData(' + '\'' + nameVal + '\'' + ')">Done</button>',
            overflow: 'hidden',
            color: '#333',
            speed: '0.3',
            opacity: '0.8',
            modal: true,
            showClose: true,
            showMax: true,
            onClose: function (event) {

            },
            onMax: function (event) {

            },
            onMin: function (event) {

            },
            onKeydown: function (event) {

            },
            width: 800,
            height: 600,
            showMax: true,
            body: '<div id="edit-app" style=""></div>' +
            '<div id="tab-annotation" style="height: 100%; border: 1px solid #ddd; border-top: 0px;"></div>'+
            '<div id="tab-phenotype" style="height: 100%; border: 1px solid #ddd; border-top: 0px;"></div>',
            onOpen: function (event) {


                $('#tab-phenotype').hide();
                $('#tab-annotation').show();

                event.onComplete = function () {


                    // render grid into each tab panel
                    $('#tab-annotation').w2render('annotationGrid');
                    $('#tab-phenotype').w2render('phenotypeGrid');

                    $('#edit-app').w2tabs({
                        name: tempName,
                        active: 'tab1',
                        tabs: [
                            { id: 'tab1', caption: 'Annotaion' },
                            { id: 'tab2', text: 'Phenotype' }
                        ],
                        onClick: function (event) {
                            if (event.target == 'tab1') {
                                $('#tab-phenotype').hide(); //tab-phenotype = content of phenotype grid
                                $('#tab-annotation').show(); //tab-annotation = content of annotation grid
                            } else {
                                $('#tab-annotation').hide();
                                $('#tab-phenotype').show();

                            }
                        }
                    });
                };

            },
            onToggle: function (event) {
                event.onComplete = function () {
                    w2ui.layout.resize();
                }
            }
        });
    }




    //function for reference genome list
    $('#accessReferencegenomeDD').change(function (event) {
        var text = event.target.options[$('#accessReferencegenomeDD').val()].textContent;
        $('#referencegenomeDD').val(text);
    })





})