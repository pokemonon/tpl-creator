module.exports = {
    extends: [
        'plugin:@pokemonon/common/common',
        <% if (vue) { %>'plugin:@pokemonon/common/vue<%= vue %>',<% } %>
    ],
};