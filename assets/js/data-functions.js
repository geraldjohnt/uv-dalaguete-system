let getUserRequests = function () {};
var loadRequestHistory = function() {};
var loadEmployees = function() {};

getUserRequests = async function(id) {
    let requests = [];
    let resetBadge = $('#reset-status-badge');
    resetBadge.removeClass('bg-warning');
    resetBadge.removeClass('bg-info');
    resetBadge.removeClass('bg-success');

    try {
        const snapshot = await db
            .ref('requests/resets')
            .orderByChild('user')
            .equalTo(id)
            .get();

        if (!snapshot.exists()) {

            console.log('No requests found.');
            return;

        }

        snapshot.forEach(function (childSnapshot) {

            requests.push({
                key: childSnapshot.key,
                ...childSnapshot.val()
            });

        });

        if (requests[0].status == 'submitted') {
            resetBadge.addClass('bg-warning')
        }

        if (requests[0].status == 'forwarded') {
            resetBadge.addClass('bg-info')
        }

        if (requests[0].status == 'done') {
            resetBadge.addClass('bg-success')
        }

        loadTrackingModal(requests[0].key, requests[0]);

        populateData(requests[0], 'reset');
        console.log("Requests: ", requests[0])

    } catch (error) {

        console.error(error);

    }
}

// LOAD REQUESTS
loadRequestHistory = async function () {
    let requests = [];

    try {

        // GET ALL USERS
        const usersSnapshot = await db
            .ref('users')
            .get();

        const users = usersSnapshot.val() || {};

        // GET ALL REQUESTS
        const requestsSnapshot = await db
            .ref('requests/resets')
            .get();

        requestsSnapshot.forEach(function (childSnapshot) {

            const reset = childSnapshot.val();

            // GET USER DETAILS
            const requestUser = users[reset.user] || {};

            requests.push({

                key: childSnapshot.key,

                fullName: `${requestUser.lastName ?? ''}, ${requestUser.firstName ?? ''}`.trim(),

                idNumber: requestUser.idNumber ?? 'N/A',

                schoolEmail: requestUser.schoolEmail ?? 'N/A',

                personalEmail: requestUser.personalEmail ?? 'N/A',

                accountType: reset.accountType ?? 'N/A',

                requestType: reset.requestType ?? 'N/A',

                remarks: reset.remarks ?? 'N/A',

                dateSubmitted: reset.dateSubmitted ?? null,

                status: reset.status ?? 'N/A'

            });

        });

        // DESTROY EXISTING DATATABLE
        if ($.fn.DataTable.isDataTable('#requestHistoryTable')) {

            $('#requestHistoryTable')
                .DataTable()
                .destroy();

        }

        // CLEAR TABLE
        $('#requestHistoryTable tbody').empty();

        // INITIALIZE DATATABLE
        $('#requestHistoryTable').DataTable({

            data: requests,

            columns: [

                {
                    data: 'fullName',
                    defaultContent: 'N/A'
                },

                {
                    data: 'idNumber',
                    defaultContent: 'N/A'
                },

                {
                    data: 'accountType',
                    defaultContent: 'N/A'
                },

                {
                    data: 'requestType',
                    defaultContent: 'N/A'
                },

                {
                    data: 'remarks',
                    defaultContent: 'N/A'
                },

                {
                    data: 'dateSubmitted',
                    render: function (data) {

                        return formatDate(data);

                    }
                },

                {
                    data: 'status',
                    render: function (data) {

                        return getStatusBadge(data);

                    }
                },

                // ACTIONS
                {
                    data: null,
                    orderable: false,
                    searchable: false,

                    render: function (data, type, row) {

                        // SUBMITTED
                        if (
                            row.status === 'submitted'
                        ) {

                            return `
                                <button
                                    class="
                                        btn
                                        btn-warning
                                        btn-sm
                                        rounded-pill
                                    "
                                    onclick="
                                        forwardRequest(
                                            '${row.key}'
                                        )
                                    "
                                >
                                    <i class="bi bi-arrow-right me-1"></i>
                                    Forward Request
                                </button>
                            `;

                        }

                        // FORWARDED
                        if (
                            row.status === 'forwarded'
                        ) {

                            return `
                                <button
                                    class="
                                        btn
                                        btn-success
                                        btn-sm
                                        rounded-pill
                                    "
                                    onclick="
                                        openDoneModal(
                                            '${row.key}'
                                        )
                                    "
                                >
                                    <i class="bi bi-check2-circle me-1"></i>
                                    Proceed to Done
                                </button>
                            `;

                        }

                        // COMPLETED
                        if (
                            row.status === 'done'
                        ) {

                            return `
                                <span
                                    class="
                                        badge
                                        bg-success
                                    "
                                >
                                    Completed
                                </span>
                            `;

                        }

                        return 'N/A';

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

// LOAD REQUESTS
loadEmployees = async function () {
    let employees = [];

    try {

        const employeesSnapshot = await db
            .ref('employees')
            .get();

        employeesSnapshot.forEach(function (childSnapshot) {

            const employee = childSnapshot.val();

            employees.push({
                idNo: employee.idNo,

                lastName: employee.lastName,

                firstName: employee.firstName,

                middleName: employee.middleName,

                homeAddress: employee.homeAddress,

                cityAddress: employee.cityAddress,

                contactNumber: employee.contactNumber,

                dateOfBirth: employee.dateOfBirth,

                age: employee.age,

                sex: employee.sex,

                civilStatus: employee.civilStatus,

                dateHired: employee.dateHired,

                yearHired: employee.yearHired,

                typeOfEmployment: employee.typeOfEmployment,

                designation: employee.designation,

                department: employee.department,

                baccalaureat: employee.baccalaureat,

                graduateStudies: employee.graduateStudies,

                postGraduate: employee.postGraduate,

                licenseNumber: employee.licenseNumber,

                dateExpiry: employee.dateExpiry,

                schoolGraduateBaccalaureat: employee.schoolGraduateBaccalaureat,

                schoolGraduateStudies: employee.schoolGraduateStudies,

                schoolGraduatePost: employee.schoolGraduatePost,

                sssNumber: employee.sssNumber,

                philHealthNumber: employee.philHealthNumber,

                hdmfNumber: employee.hdmfNumber,

                tin: employee.tin,

                bpiAccountNumber: employee.bpiAccountNumber,

                contactPerson: employee.contactPerson,

                contactPersonNumber: employee.contactPersonNumber,

                remarks: employee.remarks
            });

        });

        // DESTROY EXISTING DATATABLE
        if ($.fn.DataTable.isDataTable('#employeesTable')) {

            $('#employeesTable')
                .DataTable()
                .destroy();

        }

        // CLEAR TABLE
        $('#employeesTable tbody').empty();

        // INITIALIZE DATATABLE
        $('#employeesTable').DataTable({

            data: employees,

            columns: [

                {
                    data: 'idNo',
                    defaultContent: 'N/A'
                },

                {
                    data: 'lastName',
                    defaultContent: 'N/A'
                },

                {
                    data: 'firstName',
                    defaultContent: 'N/A'
                },

                {
                    data: 'middleName',
                    defaultContent: 'N/A'
                },

                {
                    data: 'homeAddress',
                    defaultContent: 'N/A'
                },

                {
                    data: 'cityAddress',
                    defaultContent: 'N/A'
                },

                {
                    data: 'contactNumber',
                    defaultContent: 'N/A'
                },

                {
                    data: 'dateOfBirth',
                    defaultContent: 'N/A'
                },

                {
                    data: 'age',
                    defaultContent: 'N/A'
                },

                {
                    data: 'sex',
                    defaultContent: 'N/A'
                },

                {
                    data: 'civilStatus',
                    defaultContent: 'N/A'
                },

                {
                    data: 'dateHired',
                    defaultContent: 'N/A'
                },

                {
                    data: 'yearHired',
                    defaultContent: 'N/A'
                },

                {
                    data: 'typeOfEmployment',
                    defaultContent: 'N/A'
                },

                {
                    data: 'designation',
                    defaultContent: 'N/A'
                },

                {
                    data: 'department',
                    defaultContent: 'N/A'
                },

                {
                    data: 'baccalaureat',
                    defaultContent: 'N/A'
                },

                {
                    data: 'graduateStudies',
                    defaultContent: 'N/A'
                },

                {
                    data: 'postGraduate',
                    defaultContent: 'N/A'
                },

                {
                    data: 'licenseNumber',
                    defaultContent: 'N/A'
                },

                {
                    data: 'dateExpiry',
                    defaultContent: 'N/A'
                },

                {
                    data: 'schoolGraduateBaccalaureat',
                    defaultContent: 'N/A'
                },

                {
                    data: 'schoolGraduateStudies',
                    defaultContent: 'N/A'
                },

                {
                    data: 'schoolGraduatePost',
                    defaultContent: 'N/A'
                },

                {
                    data: 'sssNumber',
                    defaultContent: 'N/A'
                },

                {
                    data: 'philHealthNumber',
                    defaultContent: 'N/A'
                },

                {
                    data: 'hdmfNumber',
                    defaultContent: 'N/A'
                },

                {
                    data: 'tin',
                    defaultContent: 'N/A'
                },

                {
                    data: 'bpiAccountNumber',
                    defaultContent: 'N/A'
                },

                {
                    data: 'contactPerson',
                    defaultContent: 'N/A'
                },

                {
                    data: 'contactPersonNumber',
                    defaultContent: 'N/A'
                },

                {
                    data: 'remarks',
                    defaultContent: 'N/A'
                },

                // ACTIONS
                {
                    data: null,
                    orderable: false,
                    searchable: false,

                    render: function (data, type, row) {

                        // SUBMITTED
                        if (
                            row.status === 'submitted'
                        ) {

                            return `
                                <button
                                    class="
                                        btn
                                        btn-warning
                                        btn-sm
                                        rounded-pill
                                    "
                                    onclick="
                                        forwardRequest(
                                            '${row.key}'
                                        )
                                    "
                                >
                                    <i class="bi bi-arrow-right me-1"></i>
                                    Forward Request
                                </button>
                            `;

                        }

                        // FORWARDED
                        if (
                            row.status === 'forwarded'
                        ) {

                            return `
                                <button
                                    class="
                                        btn
                                        btn-success
                                        btn-sm
                                        rounded-pill
                                    "
                                    onclick="
                                        openDoneModal(
                                            '${row.key}'
                                        )
                                    "
                                >
                                    <i class="bi bi-check2-circle me-1"></i>
                                    Proceed to Done
                                </button>
                            `;

                        }

                        // COMPLETED
                        if (
                            row.status === 'done'
                        ) {

                            return `
                                <span
                                    class="
                                        badge
                                        bg-success
                                    "
                                >
                                    Completed
                                </span>
                            `;

                        }

                        return 'N/A';

                    }

                }

            ],

            order: [[1, 'desc']],

            responsive: false,

            pageLength: 10,

            scrollX: true,

            scrollCollapse: true,

            fixedHeader: true,

            // autoWidth: false,

            language: {
                emptyTable: 'No employee data found.'
            },

            columnDefs: [
                {
                    targets: '_all',
                    className: 'text-nowrap'
                }
            ]

        });

    } catch (error) {

        console.error(error);

        alert('Failed to load employee data.');

    }

}