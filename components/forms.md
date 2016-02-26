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
{ sections: [
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

## Standard Field Types
Reframe includes built-in form controls that you can use by name. By specifying `type: "textfield"` in a field 
definition, the Form will use its built-in text field component. The following field types are included with Reframe:

- `button`: Triggers callbacks when clicked
- `checkbox`: a single checkbox
- `checkboxes`: a group of checkboxes
- `countryselect`: a dropdown containing a list of countries and territories
- `datefield`: A text field with a pop-up date picker
- `daterange`: A pair of fields for a start and end date
- `dateselect`: A group of three dropdowns for selecting a date by month, day, and year
- `emailfield`: A text field that accepts an email address
- `filefield`: A file uploader, supporting chunked uploads of single or multiple files
- `moneyfield`: A text field that accepts and formats an amount of currency
- `monthselect`: A dropdown containing a list of calendar months
- `numberfield`: A text field that accepts a number
- `numberselect`: A dropdown containing a choice of numbers
- `passwordfield`: A password text field
- `phonefield`: A text field that accepts a phone number
- `radios`: A group of radio buttons
- `select`: A dropdown with custom options
- `stateselect`: A dropdown containing a list of US states
- `textarea`: A large text area, optionally supporting HTML rich text editing
- `textfield`: A plain text field
- `timezoneselect`: A dropdown containing a list of time zones
- `urlfield`: A text field that accepts a URL

## Validations
Field Definitions may optionally specify some validation rules which are checked in the browser before the form is 
submitted. Forms also show validation messages that come back from the server.

To apply a validation to a field, you add it in the `validators` option of the Field Definition. For example, to limit
a user name to between 4 and 40 alphanumeric characters and is required, you would specify the following Field 
Definition:

```js
{ 
    code: "username", 
    label: 'Username', 
    type: "textfield", 
    placeholder: 'Username', 
    required: true, 
    validators: {
        alphanum: true,
        minlength: 4,
        maxlength: 40
    } 
}
```

The keys you specify inside the validators object are the rules to validate against, and the values are the arguments
for that rule. The validations are done by [validator.js](https://github.com/chriso/validator.js), and all validations
from that library are supported by Reframe. 


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
