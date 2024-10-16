// Create a custom AngularJS module
const studentApp = angular.module('studentApp', []);

// Define a service for student operations
studentApp.service('StudentService', function($http) {
    const apiUrl = 'http://localhost:3000/api/students';

    this.getStudents = function() {
        return $http.get(apiUrl);
    };

    this.addStudent = function(student) {
        return $http.post(apiUrl, student);
    };

    this.updateStudent = function(student) {
        return $http.put(`${apiUrl}/${student._id}`, student);
    };

    this.deleteStudent = function(id) {
        return $http.delete(`${apiUrl}/${id}`);
    };
});

// Define the main controller for the app
studentApp.controller('StudentController', function($scope, StudentService) {
    $scope.students = [];
    $scope.student = {};
    $scope.searchTerm = ''; // Variable for search input

    // Fetch all students
    $scope.getStudents = function() {
        StudentService.getStudents()
            .then(response => {
                $scope.students = response.data;
            })
            .catch(err => console.error(err));
    };

    // Add a new student
    $scope.addStudent = function() {
        StudentService.addStudent($scope.student)
            .then(response => {
                $scope.students.push(response.data);
                $scope.student = {}; // Reset form
            })
            .catch(err => console.error(err));
    };

    // Edit a student
    $scope.editStudent = function(student) {
        $scope.student = angular.copy(student); // Populate form with student data
    };

    // Update a student
    $scope.updateStudent = function() {
        StudentService.updateStudent($scope.student)
            .then(response => {
                const index = $scope.students.findIndex(s => s._id === $scope.student._id);
                $scope.students[index] = response.data; // Update student in the list
                $scope.student = {}; // Reset form
            })
            .catch(err => console.error(err));
    };

    // Delete a student
    $scope.deleteStudent = function(id) {
        StudentService.deleteStudent(id)
            .then(response => {
                $scope.students = $scope.students.filter(s => s._id !== id); // Remove deleted student
            })
            .catch(err => console.error(err));
    };

    // Initial fetch of students
    $scope.getStudents();
});

// Define a custom filter for searching students
studentApp.filter('studentFilter', function() {
    return function(students, searchTerm) {
        if (!searchTerm) return students;
        return students.filter(student => {
            return student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   student.department.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };
});
