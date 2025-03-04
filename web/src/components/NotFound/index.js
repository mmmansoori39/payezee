import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound({ errorCode, title, description, ctaTitle, ctaPath, showCTA }) {
  return (
    <Box position={"absolute"} left="50%" transform={"translate(-50%,-50%)"} top="50%">
      <Box textAlign="center" py={10} px={6}>
        {errorCode && (
          <Heading
            display="inline-block"
            as="h2"
            size="2xl"
            bgGradient="linear(to-r, teal.400, teal.600)"
            backgroundClip="text">
            {errorCode}
          </Heading>
        )}
        {title && (
          <Text fontSize="18px" mt={3} mb={2}>
            {title}
          </Text>
        )}
        {description && (
          <Text color={"gray.500"} mb={6}>
            {description}
          </Text>
        )}
        {ctaTitle && showCTA && (
          <Link to={ctaPath ? ctaPath : "/"}>
            <Button
              colorScheme="teal"
              bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
              color="white"
              variant="solid">
              {ctaTitle}
            </Button>
          </Link>
        )}
      </Box>
    </Box>
  );
}
