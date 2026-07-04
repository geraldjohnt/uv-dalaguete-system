let getUserRequests = function () {};
var loadRequestHistory = function() {};

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