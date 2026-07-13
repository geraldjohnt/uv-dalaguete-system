var activateSideBar = function() {};
var populateData = function() {};
var runACL = function() {};
var isDate = function() {};
var formatDate = function() {};
var logout = function() {};
var loadTrackingModal = function() {};
var openRequestSubmittedModal = function() {};
var forwardRequest = function() {};
var openDoneModal = function() {};
var getStatusBadge = function() {};

activateSideBar = function(page, group = null) {
    $(`.nav-link`).removeClass('active');
    $(`#sb-${page}`).addClass('active');

    if (group != null) {
        const collapse = new bootstrap.Collapse(`#${group}`, {
            toggle: false
        });

        collapse.show();
    }
}

activateTopBar = function(title) {
    console.log('Title: ', title)
    $(`#tb-title`).html(title);
}

populateData = function(data, type='') {
    type = type != '' ? type + '-' : type;
    // LOOP THROUGH USER OBJECT
    for (const key in data) {

        // FIND ELEMENT WITH SAME ID
        const element = $(`.${type}${key}`);
        var value = data[key];

        if (isDate(key)) {
            value = new Date(value).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }

        // CHECK IF ELEMENT EXISTS
        if (element.length) {

            // SET VALUE
            element.text(value || 'N/a');

        }

    }
}

runACL = function(role) {
    $('.user-role').removeClass('d-none');
    if (role == 'admin') {
        $('.admin-role').removeClass('d-none');
    }

    if (role == 'hr') {
        $('.hr-role').removeClass('d-none');
    }
}

isDate = function(key) {
    var dateVariables = ['dateSubmitted', 'dateDone', 'dateFormatted'];

    return dateVariables.includes(key);
}


// FORMAT DATE
formatDate = function (dateString) {

    if (!dateString) {
        return 'N/A';
    }

    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

}

logout = function (e) {
    e.preventDefault();

    localStorage.removeItem('studentSession');

    window.location.href = 'index.html';
}

// OPEN TRACKING MODAL
loadTrackingModal = function (requestId, request) {

    // RESET STATES
    $('.tracking-step')
        .removeClass('completed active');

    // REQUEST INFO
    $('#trackingTicketNumber')
        .text(requestId);

    $('#trackingAccount')
        .text(request.accountType ?? 'N/A');

    $('#trackingRequestType')
        .text(request.requestType ?? 'N/A');

    $('#trackingRemarks')
        .text(request.remarks ?? 'N/A');

    // STEP 1 ALWAYS COMPLETED
    $('#trackingStepSubmitted')
        .addClass('completed');

    $('#trackingDateSubmitted')
        .text(`Completed • ${formatDate(request.dateSubmitted)}`);

    // STEP 2
    if (
        request.status === 'forwarded' ||
        request.status === 'done'
    ) {

        $('#trackingStepForwarded')
            .addClass('completed');

        $('#trackingStepForwardedIcon')
            .html('<i class="bi bi-check-lg"></i>')

        $('#trackingDateForwarded')
            .text(`Completed • ${formatDate(request.dateForwarded)}`)
            .removeClass('text-primary')
            .addClass('text-success');

    } else {

        $('#trackingStepForwarded')
            .addClass('active');

    }

    // STEP 3
    if (request.status === 'done') {

        $('#trackingDateDone')
            .text(`Completed • ${formatDate(request.dateDone)}`)
            .removeClass('text-muted')
            .removeClass('text-primary')
            .addClass('text-success')
        
        $('#trackingStepDoneIcon')
            .html('<i class="bi bi-clock"></i>')

        $('#trackingStepDone')
            .addClass('completed');

    }
    
    if (request.status === 'forwarded') {

        $('#trackingDateDone')
            .text('Currently Processing')
            .removeClass('text-muted')
            .addClass('text-primary')
        
        $('#trackingStepDoneIcon')
            .html('<div class="spinner-border spinner-border-sm"></div>')

        $('#trackingStepDone')
            .addClass('active')
    }

}

// OPEN SUCCESS MODAL
openRequestSubmittedModal = function (requestId) {

    console.log('I am called openRequestSubmittedModal')

    // GENERATE TRACKING LINK
    const trackingLink =
        `${window.location.origin}` +
        `/tracker.html?tracking=${requestId}`;

    // SET INPUT VALUE
    $('#trackingLinkInput')
        .val(trackingLink);

    // SHOW MODAL
    $('#requestSubmittedModal')
        .modal('show');

}

// FORWARD REQUEST
forwardRequest = async function (requestId) {

    try {

        await db
            .ref('requests/resets/' + requestId)
            .update({

                status: 'forwarded',

                dateForwarded:
                    new Date().toISOString()

            });

        alert('Request forwarded successfully.');

        loadRequestHistory();

    } catch (error) {

        console.error(error);

        alert('Failed to forward request.');

    }

}

// OPEN DONE MODAL
openDoneModal = function (requestId) {

    $('#doneRequestId')
        .val(requestId);

    $('#remarksDone')
        .val('');

    $('#doneRequestModal')
        .modal('show');

}
    
// STATUS BADGE
getStatusBadge = function (status) {

    let badgeClass = 'bg-secondary';

    switch (status) {

        case 'submitted':
            badgeClass = 'bg-warning text-dark';
            break;

        case 'forwarded':
            badgeClass = 'bg-primary';
            break;

        case 'done':
            badgeClass = 'bg-success';
            break;

    }

    return `
        <span class="badge ${badgeClass} status-badge">
            ${status}
        </span>
    `;

}