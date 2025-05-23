# Sketch: Authentication Integration for React on Cloudflare 

This sketch provides a minimal setup to get Melody Auth working with a React template configured for deployment in Cloudflare.

The bones of this are from the Cloudflare React Template: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/

The authentication flow is using 'react-oidc-context': https://github.com/authts/react-oidc-context

## Configuring Melody

You will need to add an App via the Admin Panel, which will give you the Client Id - it can be called anything you want

You will need to add the URI of where this sketch is hosted/running from to the 'Redirect URIs' in the App via the Admin Panel - for local development, the default http://localhost:5173/

You will need to add a Role via the Admin Panel called 'sketch_auth_admin', which is used in the sketch to show/hide a button

By adding the 'sketch_auth_admin' role to the user you are logging in with this will toggle a button to be shown in the sketch - this is configured in Users via the Admin Panel

## Configuring the sketch for local development

Copy the sample.env file to .env.local and edit variables in the .env.local to match how you have setup your local environment.

`cp sample.env .env.local`

They are set to default so you shouldn't have to do much.

## Running the sketch locally

Run your the Melody Auth server locally

`cd [path to melody auth]/server`
`npm run dev:start`

For configuration of the Admin Panel, see: https://auth.valuemelody.com/admin-panel-setup.html

Run the sketch locally

`npm run dev`