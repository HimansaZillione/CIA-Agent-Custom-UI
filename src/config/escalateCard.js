const escalateCard = {
  type: "AdaptiveCard",
  $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.5",
  body: [
    {
      type: "TextBlock",
      text: "Please provide your details",
      weight: "Bolder",
      size: "Medium"
    },
    {
      type: "Input.Text",
      id: "customerName",
      placeholder: "Enter your full name",
      label: "Name",
      isRequired: true,
      errorMessage: "Name is Required"
    },
    {
      type: "Input.Text",
      id: "Jobtitle",
      placeholder: "Enter your job title",
      label: "Title"
    },
    {
      type: "Input.Text",
      id: "companyName",
      placeholder: "Enter your company name",
      label: "Company Name"
    },
    {
      type: "Input.Text",
      placeholder: "abc@gmail.com",
      isRequired: true,
      label: "Email Address",
      id: "Email",
      errorMessage: "Email Address is required"
    },
    {
      type: "Input.Text",
      placeholder: "+94 77 123 4567",
      label: "Mobile Number",
      id: "MobileNumber",
      isRequired: true,
      errorMessage: "Mobile Number is required"
    }
  ],
  actions: [
    {
      type: "Action.Submit",
      title: "Submit"
    }
  ]
}

export default escalateCard