(function() {
  'use strict'

  angular.module('app')
    .component('articleList', {
      controller: controller,
      templateUrl: '/js/articles/article-list.html'
    })

  controller.$inject = ['$http']
  function controller($http) {
    const vm = this

    vm.$onInit = function () {
      $http.get('/api/posts').then(function (response) {
        vm.articles = response.data
        vm.newFormVisible = false
      })
      vm.sort = '-vote_count'

    }

    vm.toggleNewPostForm = function() {
      delete vm.newArticle
      vm.newFormVisible = !vm.newFormVisible
      delete vm.filter
    }

    vm.toggleCommentForm = function(articleId) {
      vm.articles.forEach((article) => {
        if (article.id === articleId) {
          article.newCommentVisible = !vm.newCommentVisible
        }
      })
    }

    vm.createArticle = function() {
      vm.newFormVisible = false;
      vm.newArticle.vote_count = 0;
      $http.post('/api/posts', vm.newArticle).then(function (response) {
        vm.createdArticle = response.data
        vm.articles.push(vm.createdArticle);
      })
      .catch((err) => {
        console.log(err);
      })

      vm.newFormVisible = false
      delete vm.newArticle
    }

    vm.upVote = function(id) {
      vm.articles.forEach((article) => {
        if (article.id === id) {
          $http.post(`/api/posts/${id}/votes`).then(function (response) {
          })
          article.vote_count ++
        }
      })
    }

    vm.downVote = function(id) {
      vm.articles.forEach((article) => {
        if (article.id === id && article.vote_count > 0) {
          $http.delete(`/api/posts/${id}/votes`).then(function (response) {
          })
          article.vote_count --
        }
      })
    }

    vm.addComment = function(id) {
      vm.articles.forEach((article) => {
        if (article.id === id) {
          if (article.comments === undefined) {
            article.comments = []
          }
          let newComment = { post_id: id, content: vm.newComment.content  }

          $http.post(`/api/posts/${id}/comments`, newComment).then(function (response) {
            delete vm.newComment
            article.comments.push(response.data);
          })
          article.newCommentVisible = false

        }
      })
    }

  }

}());
