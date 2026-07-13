var loadEvaluations = function() {};
var getComputedScore = function() {};

// LOAD REQUESTS
loadEvaluations = async function () {
    let employee = [];
    let ratings = [];
    let periods = [];

    try {

        const ratingsSnapshot = await db
            .ref('ratings')
            .get();

        for (const [key, rating] of Object.entries(ratingsSnapshot.val())) {

        // ratingsSnapshot.forEach(async function (childSnapshot) {

            const ratingField = [
                'jobUnderstanding', 'productivity', 
                'diligence', 'initiative', 
                'interpersonal', 'attendance', 
                'growth', 'personality'
            ];
            // const rating = childSnapshot.val();
            
            const employeesSnapshot = await db
                .ref(`employees/${rating.employeeId}`)
                .get();

            employee = employeesSnapshot.val() || {};

            const periodsSnapshot = await db
                .ref(`periods/${rating.periodId}`)
                .get();

            var period = periodsSnapshot.val();
            
            var periodName = period.yearStart + "-" + period.yearEnd + " " + period.semester;
                
            var totalScore = 0;
            var averageScore = 0;
            var rate = 'Poor Performance';

            ratingField.forEach(function(field) {
                totalScore = totalScore + Number(rating[field]);
            });

            averageScore = parseFloat(totalScore / 33).toFixed(1);

            if (averageScore >= 2) {
                rate = 'Below Average';
            }

            if (averageScore >= 3.4) {
                rate = 'Satisfactory Performance';
            }

            if (averageScore >= 3.8) {
                rate = 'High Performance';
            }

            ratings.push({
                key: key,

                employee: employee.firstName + " " + employee.lastName,

                department: employee.department,

                periodName: periodName,

                jobUnderstanding: rating.jobUnderstanding,

                productivity: rating.productivity,

                diligence: rating.diligence,

                initiative: rating.initiative,

                interpersonal: rating.interpersonal,

                attendance: rating.attendance,

                growth: rating.growth,

                personality: rating.personality,

                totalScore: totalScore,

                averageScore: averageScore,

                rate: rate
            });

        }

        // DESTROY EXISTING DATATABLE
        if ($.fn.DataTable.isDataTable('#ratingsTable')) {

            $('#ratingsTable')
                .DataTable()
                .destroy();

        }

        // CLEAR TABLE
        $('#ratingsTable tbody').empty();

        // INITIALIZE DATATABLE
        $('#ratingsTable').DataTable({

            data: ratings,

            columns: [

                {
                    data: 'employee',
                    defaultContent: 'N/A'
                },

                {
                    data: 'department',
                    defaultContent: 'N/A'
                },

                {
                    data: 'periodName',
                    defaultContent: 'N/A'
                },

                {
                    data: 'jobUnderstanding',
                    defaultContent: 'N/A'
                },

                {
                    data: 'productivity',
                    defaultContent: 'N/A'
                },

                {
                    data: 'diligence',
                    defaultContent: 'N/A'
                },

                {
                    data: 'initiative',
                    defaultContent: 'N/A'
                },

                {
                    data: 'interpersonal',
                    defaultContent: 'N/A'
                },

                {
                    data: 'attendance',
                    defaultContent: 'N/A'
                },

                {
                    data: 'growth',
                    defaultContent: 'N/A'
                },

                {
                    data: 'personality',
                    defaultContent: 'N/A'
                },

                {
                    data: 'totalScore',
                    defaultContent: 'N/A'
                },

                {
                    data: 'averageScore',
                    defaultContent: 'N/A'
                },

                {
                    data: 'rate',
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

            order: [[2, 'asc']],

            responsive: false,

            pageLength: 10,

            scrollX: true,

            scrollCollapse: true,

            fixedHeader: true,

            // autoWidth: false,

            language: {
                emptyTable: 'No employee rating data found.'
            },

            columnDefs: [
                {
                    targets: '_all',
                    className: 'text-nowrap'
                }
            ]

        });

    } catch (error) {

        alert('Failed to load ratings data.');
        console.log(error)

    }

}