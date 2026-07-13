let loadDepartments = function () {};
let loadPeriods = function () {};
let loadHrSettings = function () {};

loadHrSettings = function() {
    loadDepartments();
    loadPeriods();
}

loadDepartments = async function() {
    let departments = [];

    try {

        // GET ALL Departments
        const departmentsSnapshot = await db
            .ref('departments')
            .get();

        departmentsSnapshot.forEach(function (childSnapshot) {

            const department = childSnapshot.val();

            departments.push({

                id: childSnapshot.key,
                department: department.department ?? 'N/A',

            });

        });

        console.log("Departments: ", departments)

        // DESTROY EXISTING DATATABLE
        if ($.fn.DataTable.isDataTable('#departmentsTable')) {

            $('#departmentsTable')
                .DataTable()
                .destroy();

        }

        // CLEAR TABLE
        $('#departmentsTable tbody').empty();

        // INITIALIZE DATATABLE
        $('#departmentsTable').DataTable({

            data: departments,

            columns: [

                {
                    data: 'department',
                    defaultContent: 'N/A'
                },

                // ACTIONS
                {
                    data: null,
                    orderable: false,
                    searchable: false,

                    render: function (data, type, row) {

                        return `
                            <div class="d-flex justify-content-center gap-2">

                                <button
                                    type="button"
                                    class="btn btn-outline-primary btn-sm rounded-circle"
                                    style="width:36px;height:36px"
                                    data-bs-toggle="tooltip"
                                    title="Edit Department"
                                    onclick="editDepartment('${row.id}')">

                                    <i class="bi bi-pencil"></i>

                                </button>

                                <button
                                    type="button"
                                    class="btn btn-outline-danger btn-sm rounded-circle"
                                    style="width:36px;height:36px"
                                    data-bs-toggle="tooltip"
                                    title="Delete Department"
                                    onclick="deleteDepartment('${row.id}')">

                                    <i class="bi bi-trash"></i>

                                </button>

                            </div>
                        `;

                    }

                }

            ],

            order: [[0, 'desc']],

            responsive: true,

            pageLength: 10,

            language: {
                emptyTable: 'No department found.'
            }

        });

    } catch (error) {

        console.error(error);

        alert('Failed to load departments.');

    }
}

loadPeriods = async function() {
    let periods = [];

    try {

        // GET ALL Departments
        const periodsSnapshot = await db
            .ref('periods')
            .get();

        periodsSnapshot.forEach(function (childSnapshot) {

            const period = childSnapshot.val();

            periods.push({

                id: childSnapshot.key,
                semester: period.semester ?? 'N/A',
                yearStart: period.yearStart ?? 'N/A',
                yearEnd: period.yearEnd ?? 'N/A',

            });

        });

        // DESTROY EXISTING DATATABLE
        if ($.fn.DataTable.isDataTable('#periodsTable')) {

            $('#periodsTable')
                .DataTable()
                .destroy();

        }

        // CLEAR TABLE
        $('#periodsTable tbody').empty();

        // INITIALIZE DATATABLE
        $('#periodsTable').DataTable({

            data: periods,

            columns: [

                {
                    data: 'semester',
                    defaultContent: 'N/A'
                },

                {
                    data: 'yearStart',
                    defaultContent: 'N/A'
                },

                {
                    data: 'yearEnd',
                    defaultContent: 'N/A'
                },

                // ACTIONS
                {
                    data: null,
                    orderable: false,
                    searchable: false,

                    render: function (data, type, row) {

                        return `
                            <div class="d-flex justify-content-center gap-2">

                                <button
                                    type="button"
                                    class="btn btn-outline-primary btn-sm rounded-circle"
                                    style="width:36px;height:36px"
                                    data-bs-toggle="tooltip"
                                    title="Edit Department"
                                    onclick="editDepartment('${row.id}')">

                                    <i class="bi bi-pencil"></i>

                                </button>

                                <button
                                    type="button"
                                    class="btn btn-outline-danger btn-sm rounded-circle"
                                    style="width:36px;height:36px"
                                    data-bs-toggle="tooltip"
                                    title="Delete Department"
                                    onclick="deleteDepartment('${row.id}')">

                                    <i class="bi bi-trash"></i>

                                </button>

                            </div>
                        `;

                    }

                }

            ],

            order: [[5, 'desc']],

            responsive: true,

            pageLength: 10,

            language: {
                emptyTable: 'No request history found.'
            }

        });

    } catch (error) {

        console.error(error);

        alert('Failed to load request history.');

    }
}