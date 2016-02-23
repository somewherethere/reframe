---
layout: page
title: Forms
in_nav: false
---

The **Form** component, sometimes referred to as Dataform, produces validated multi-part forms from a declarative
configuration syntax.

![A screenshot of a form](/images/form-screenshot.png)

## Constructing Forms

Forms are defined by structured JSON which describes the fields and validations for those fields.

It begins with `sections`, which is an array that contains a list of fields. The sections structure is as follows:

```js
{
sections: [
    { fields: [
      { code: "email", label: 'Email', type: "emailfield", placeholder: 'Email', required: true }
    ]}
  ]
}
```

`sections` is an array of _Objects_, called a _Section Object_. A section object has a single property, `fields`. 
`fields` is an array of _Field Definitions_.

## Field Definitions
Field Definitions describe the format and behavior of a field. Field definitions look like this:

```js
{ code: "email", label: 'Email', type: "emailfield", placeholder: 'Email', required: true }
```

A field definition has the following required keys:

- `code`: The unique name of this field; this is what will be posted to your server
- `label`: The label text to attach to the field
- `type`: A String or React Element that defines what component will be used to render the field

A field definition may have the following optional keys:

- `placeholder`: A string of placeholder text
- `required`: Part of validations; boolean flag of whether the field is required for submission
- `validators`: Part of validations; an Object containing the validations for this field and their arguments

## API

A Form component accepts the following props:

#### Configuration:

- `title`: A title to display above the form
- `sections`: The array of form sections to render
- `buttons`: An array of custom button configurations
- `endpoint`: The API endpoint to load data from
- `action`: The API endpoint to post data to 
- `message`: A message to display at the bottom of the form
- `messageTitle`: A small heading to display at the bottom of the form
- `messageType`: What styling to apply to the message at the bottom of the form
- `loading`: Boolean flag to render the form's loading state
- `unstyled`: Boolean flag to strip basic styling from the form
- `borderless`: Boolean flag to remove borders and lines from the form 
- `class`: Custom CSS classes to apply
- `style`: Custom CSS styles to apply

#### Callbacks:

- `onSubmit`: function to call when form submits
- `onCancel`: function to call when form is cancelled
- `onFieldChange`: function to call when a field changes its value

## Reference

#### `title`

#### `sections`

#### `buttons`

#### `endpoint`

#### `action`

#### `message`

#### `messageTitle`

#### `messageType`

#### `loading`

#### `unstyled`

#### `borderless`

#### `class`

#### `style`
