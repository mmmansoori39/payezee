import { Box, Button, FormControl, FormHelperText, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSignature } from "../../services/signature";

const GenerateSignature = () => {
  const [formValues, setFormValues] = useState({
    apiKey: "",
    merchantKey: "",
    merchantPassphrase: "",
    jsonBody: ""
  });
  const [invalidJson, setInvalidJson] = useState(false);
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState("");

  useEffect(() => {
    try {
      const ls = localStorage.getItem("signature-generate");
      if (ls) {
        setFormValues(JSON.parse(ls));
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleChange = (key) => (event) => {
    const value = event.target.value.trim();
    console.log(value, key);
    setFormValues((p) => ({
      ...p,
      [key]: value
    }));
    localStorage.setItem("signature-generate", JSON.stringify(formValues));
    if (key === "jsonBody") {
      try {
        JSON.parse(String(event.target.value).trim());
        setInvalidJson(false);
      } catch (error) {
        setInvalidJson(true);
      }
    }
  };
  const handleSubmit = () => {
    if (!invalidJson) {
      setFormValues((p) => ({
        ...p,
        jsonBody: JSON.stringify(JSON.parse(p.jsonBody), null, 5)
      }));
      setLoading(true);
      getSignature(formValues).then((res) => {
        setLoading(false);
        if (res.ok) {
          const output = `Authorization: ${res.data.responseData.authorization}\nSignature: ${res.data.responseData.signature}`;
          setResponse(output);
        } else {
          console.error(res);
          toast.error("Something went wrong! Check the logs");
        }
      });
    }
  };

  return (
    <Box pb="10">
      <Box bg="white" p="6" borderRadius="xl" maxWidth="1000px" margin={"auto"} mt="10">
        <FormControl isRequired>
          <FormLabel>Enter API Key</FormLabel>
          <Input value={formValues.apiKey} placeholder="Enter API Key" onChange={handleChange("apiKey")} />
        </FormControl>
        <FormControl mt="6" isRequired>
          <FormLabel>Enter Merchant Key</FormLabel>
          <Input
            value={formValues.merchantKey}
            placeholder="Enter Merchant Key"
            onChange={handleChange("merchantKey")}
          />
        </FormControl>
        <FormControl mt="6" isRequired>
          <FormLabel>Enter Merchant Passphrase</FormLabel>
          <Input
            value={formValues.merchantPassphrase}
            placeholder="Enter Merchant's Passphrase"
            onChange={handleChange("merchantPassphrase")}
          />
        </FormControl>
        <FormControl mt="6" isRequired>
          <FormLabel>Enter JSON Body</FormLabel>
          <Textarea
            value={formValues.jsonBody}
            borderRadius="lg"
            placeholder="Enter JSON Body"
            size="sm"
            rows={10}
            onChange={handleChange("jsonBody")}
          />
          <FormHelperText color="red">{invalidJson && "Invalid JSON"}</FormHelperText>
        </FormControl>
        <Button isLoading={loading} mt="6" onClick={handleSubmit}>
          Generate
        </Button>
        <FormControl mt="6">
          <FormLabel>Generated Output</FormLabel>
          <Textarea value={response} borderRadius="lg" size="sm" rows={2} />
        </FormControl>
      </Box>
    </Box>
  );
};

export default GenerateSignature;
