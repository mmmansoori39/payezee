import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Switch,
  Textarea
} from "@chakra-ui/react";
import { Field, Form, useField } from "react-final-form";
import { FiCopy } from "react-icons/fi";
import { copyToClipboard } from "../../utils/common";
import { validate } from "./helper";

const Control = ({ name, ...rest }) => {
  const {
    meta: { error, touched }
  } = useField(name, { subscription: { touched: true, error: true } });
  return <FormControl {...rest} isInvalid={error && touched} />;
};

const AdaptedTextarea = ({ input, meta, ...rest }) => (
  <Textarea {...input} {...rest} isInvalid={meta.error && meta.touched} />
);

const TextareaControl = ({ name, label }) => (
  <Control name={name} my={4}>
    <FormLabel htmlFor={name}>{label}</FormLabel>
    <Field name={name} component={AdaptedTextarea} placeholder={label} id={name} />
    <Error name={name} />
  </Control>
);

const SwitchControl = ({ name, label }) => {
  const {
    input: { ...input },
    meta: { touched, invalid }
  } = useField(name, {
    type: "checkbox" // important for RFF to manage the checked prop
  });
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel htmlFor="email-alerts" mb="0">
        {label}
      </FormLabel>
      <Switch {...input} isChecked={input.checked} isInvalid={touched && invalid} />
    </FormControl>
  );
};

const Error = ({ name }) => {
  const {
    meta: { error }
  } = useField(name, { subscription: { error: true } });
  return <FormErrorMessage>{error}</FormErrorMessage>;
};

const InputControl = ({ name, label, readOnly, rightElement }) => {
  const { input, meta } = useField(name);
  const RightElement = () => rightElement;
  return (
    <Control name={name} my={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Flex alignItems={"center"}>
        <Input {...input} isInvalid={meta.error && meta.touched} id={name} placeholder={label} readOnly={readOnly} />
        {!!rightElement && <RightElement />}
      </Flex>
      <Error name={name} />
    </Control>
  );
};

const CopyButton = ({ text }) => {
  return (
    <Button
      ml="1"
      fontSize={"xl"}
      onClick={() => {
        copyToClipboard(text);
      }}>
      <FiCopy aria-label="copy" />
    </Button>
  );
};

const MerchantRegisterForm = ({ onSubmit, isEdit, values, onModalClose }) => {
  return (
    <Form
      initialValues={values}
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <Box
          as="form"
          p={4}
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="1px 1px 3px rgba(0,0,0,0.3)"
          onSubmit={handleSubmit}>
          {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
          {isEdit && (
            <>
              <InputControl name="apiKey" label="API Key" readOnly rightElement={<CopyButton text={values.apiKey} />} />
              <InputControl
                name="password"
                label="Dashboard Password"
                readOnly
                rightElement={<CopyButton text={values.password} />}
              />
              <InputControl
                name="merchantKey"
                label="Merchant Key"
                readOnly
                rightElement={<CopyButton text={values.merchantKey} />}
              />
              <InputControl
                name="merchantPassphrase"
                label="Merchant Passphrase"
                readOnly
                rightElement={<CopyButton text={values.merchantPassphrase} />}
              />
            </>
          )}
          <Heading color={"gray.800"} as="h1" size={isEdit ? "lg" : "xl"} textAlign="center">
            {isEdit ? "Edit Merchant Info" : "Add Merchant"}
          </Heading>

          <InputControl name="name" label="Merchant's Name" />
          <InputControl name="contactEmail" label="Email" />
          <InputControl name="contactMobileNumber" label="Mobile Number" />
          <InputControl name="contactPersonName" label="Contact Person Name" />
          {/* <InputControl name="website" label="Merchant's Website" /> */}
          <TextareaControl name="description" label="Description" />
          {isEdit && <SwitchControl name="isActive" label={"Is Active?"} />}
          <ButtonGroup spacing={4} mt="4">
            <Button isLoading={submitting} loadingText="Submitting" variantColor="teal" type="submit">
              {isEdit ? "Update" : "Submit"}
            </Button>
            <Button variantColor="teal" variant="outline" onClick={form.reset} isDisabled={submitting || pristine}>
              Reset
            </Button>
            <Button type="button" variantColor="red" onClick={onModalClose} isDisabled={submitting}>
              Close
            </Button>
          </ButtonGroup>
        </Box>
      )}
    />
  );
};

export default MerchantRegisterForm;
