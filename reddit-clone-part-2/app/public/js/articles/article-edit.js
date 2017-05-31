(function() {
  'use strict'

  angular.module('app')
    .component('articleEdit', {
      controller: controller,
      templateUrl: '/js/articles/article-edit.html'
    })

  controller.$inject = ['$http', '$stateParams','$location']
  function controller($http, $stateParams, $location) {
    const vm = this

    vm.$onInit = function () {
      $http.get(`/api/posts/${$stateParams.articleId}`).then(function (response) {
        vm.editArticle = response.data
      })
      .catch(err => {
        console.log(err);
      })
    }

    vm.updateArticle = function(articleId) {
      $http.patch(`/api/posts/${articleId}`, vm.editArticle).then(function (response) {
        $location.path('/').replace()
      })
      .catch(err => {
        console.log(err);
      })
    }

  }




}());
