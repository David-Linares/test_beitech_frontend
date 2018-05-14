(function(){

    var beitechapp =  angular.module("beitechapp", []);
    beitechapp.constant('URL_SERVICE', "http://localhost:8080")

    //controllers

    beitechapp.controller("appController" , appController);

    appController.$inject = ['$scope', '$http', 'URL_SERVICE'];
    function appController($scope, $http, URL_SERVICE) {
        $scope.customer_list = [];
        $scope.form = { detail : []}
        $scope.current_date = new Date();
        $scope.initial_date = new Date();
        $scope.initial_date.setMonth($scope.current_date.getMonth() - 1);

        $scope.getCustomers = function() {
            $http.get(URL_SERVICE + "/customer").success(function (data, status) {
                console.log(data);
                $scope.customer_list = data;
            }).error(function (data, status, headers, config) {
                console.log("Error " + data + " " + status);
                $scope.message = "There was an error creating the matrix";
            });
        }

        $scope.reset_list_products = function(){
            $scope.form.detail = [];
        }

        $scope.add_product = function(){
            $scope.form.detail.push({"product_description":$scope.product_select.nameProduct});
            $scope.product_select = {};
        }

        $scope.getOrders = function(){
            $http({method: "GET", url: URL_SERVICE + "/orders/customer/"+$scope.customer_query.customerId,
                params: {
                    initial_date: $scope.initial_date.getFullYear() + "-" + ($scope.initial_date.getMonth() + 1) + "-" + $scope.initial_date.getDate(),
                    finish_date: $scope.current_date.getFullYear() + "-" + ($scope.current_date.getMonth() + 1) + "-" + $scope.current_date.getDate()
                }})
            .success(function(data, status) {
                $scope.order_list = data;
            }).error(function(data, status, headers, config) {
                console.log("Error " + data + " " + status);
                $scope.message = "There was an error creating the matrix";
            });
        }

        $scope.calculate_total = function(detail){
            sum = 0;
            for (d in detail){
                sum += detail[d].price;
            }
            return sum;
        }

        $scope.saveOrder = function(){
            $scope.form.id_customer = $scope.form.id_customer.customerId.toString();
            console.log($scope.form);
            $http({method: "POST", url: URL_SERVICE + "/orders",
                data: $scope.form})
                .success(function(data, status) {
                    alert(data.msg);
                    $scope.form = { detail : []}
                }).error(function(data, status, headers, config) {
                console.log("Error " + data + " " + status);
                $scope.message = "There was an error creating the matrix";
            });
        }

        $scope.getCustomers();
    }
})();