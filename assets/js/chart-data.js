var loadCharts = function() {};

// LOAD CHARTS
loadCharts = async function () {
    var ratings = await db.ref('ratings').get();
    var employees = await db.ref('employees').get();
    var periods = await db.ref('periods').get();
    
    const ratingField = [
        'jobUnderstanding', 'productivity', 
        'diligence', 'initiative', 
        'interpersonal', 'attendance', 
        'growth', 'personality'
    ];

    var employeeDataset = {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Average Rating',
                data: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    };

    var departmentDataset = {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Average Rating',
                data: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    };

    var performanceDataset = {
        type: 'pie',
        data: {
            labels: [
                'Poor Performance',
                'Below Average',
                'Satisfactory Performance',
                'High Performance'
            ],
            datasets: [{
                data: [2, 5, 20, 12]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    };

    var ratingDataset = {
        type: 'line',
        data: {
            labels: [
            ],
            datasets: [{
                label: 'Average Rating',
                data: [],
                tension: .4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    };

    ratings = ratings.val();
    employees = employees.val();
    periods = periods.val();

    var departmentsAverage = {};
    var performanceDistribution = {
        "Poor Performance": 0,
        "Below Average": 0,
        "Satisfactory Performance": 0,
        "High Performance": 0,
    };

    console.log("Ratings: ", ratings)

    for (const [key, period] of Object.entries(periods)) {
        const periodRatings = Object.entries(ratings)
            .filter(([ratingKey, rating]) => rating.periodId === key);

        var total = 0;
        var average = 0;

        console.log("periodRatings: ", periodRatings)

        for (const [ratingKey, rating] of periodRatings) {
            var partialTotal = 0;

            ratingField.forEach(function(field) {
                partialTotal = partialTotal + Number(rating[field]);
            });

            partialTotal = parseFloat(partialTotal / 33).toFixed(1);

            total = Number(total) + Number(partialTotal);
        }

        average = parseFloat(total / periodRatings.length).toFixed(1);

        ratingDataset.data.labels.push(`${period.semester} ${period.yearStart}-${period.yearEnd}`);
        ratingDataset.data.datasets[0].data.push(`${average}`);
    }

    console.log("ratingDataset: ", ratingDataset)

    for (const [key, employee] of Object.entries(employees)) {
        const employeeRatings = Object.entries(ratings)
            .filter(([ratingKey, rating]) => rating.employeeId === key);

        var total = 0;
        var average = 0;

        console.log("Employee Ratings: ", employeeRatings)

        for (const [ratingKey, rating] of employeeRatings) {
            var partialTotal = 0;

            ratingField.forEach(function(field) {
                partialTotal = partialTotal + Number(rating[field]);
            });

            partialTotal = parseFloat(partialTotal / 33).toFixed(1);

            total = Number(total) + Number(partialTotal);
            console.log("partialTotal: ", partialTotal)
        }

        average = Number(parseFloat(total / employeeRatings.length).toFixed(1));

        employeeDataset.data.labels.push(`${employee.firstName} ${employee.lastName}`);
        employeeDataset.data.datasets[0].data.push(`${average}`);

        if (!departmentsAverage.hasOwnProperty(employee.department)) {
            departmentsAverage[employee.department] = [];
        }

        console.log("departmentsAverage: ", departmentsAverage)

        if (!Number.isNaN(average)) {
            departmentsAverage[employee.department].push(average);
        }

        if (average < 2) {
            performanceDistribution['Poor Performance']++;
        } else if (average < 3.4) {
            performanceDistribution['Below Average']++;
        } else if (average < 3.8) {
            performanceDistribution['Satisfactory Performance']++;
        } else {
            performanceDistribution['High Performance']++;
        }

        performanceDataset.data.datasets[0].data = [
            performanceDistribution['Poor Performance'],
            performanceDistribution['Below Average'],
            performanceDistribution['Satisfactory Performance'],
            performanceDistribution['High Performance'],
        ];

        console.log("Total: ", total)
        console.log("employeeRatings Count: ", employeeRatings.length)
        console.log("Average: ", average)
    }

    for (const [key, deptAve] of Object.entries(departmentsAverage)) {
        departmentDataset.data.labels.push(key);
        var departmentValue = 0;

        deptAve.forEach(function(average) {
            departmentValue += Number(average);
        });

        departmentValue = Number(parseFloat(departmentValue / deptAve.length).toFixed(1));
        departmentDataset.data.datasets[0].data.push(departmentValue);
    }

    console.log("departmentDataset: ", departmentDataset.data.datasets[0].data)

    const employeeChart = new Chart(
        document.getElementById('employeeChart'),
        employeeDataset
    );

    const departmentChart = new Chart(
        document.getElementById('departmentChart'),
        departmentDataset
    );

    const performancePieChart = new Chart(
        document.getElementById('performancePieChart'),
        performanceDataset
    );

    const ratingTrendChart = new Chart(
        document.getElementById('ratingTrendChart'),
        ratingDataset
    );
}