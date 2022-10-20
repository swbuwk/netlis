import { Box, Button, Flex, Heading, Input, useToast, VStack } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import React, { FC, useRef } from 'react'
import imageCompression from 'browser-image-compression';
import { useAppSelector } from '../../hooks/redux'
import { Album } from '../../models/Album'
import InputField from './Field/InputField'
import SelectField from './Field/SelectField'
import InputTextArea from './Field/TextAreaField'
import * as yup from 'yup';
import FileField, { FileFieldOptions } from './Field/FileField'
import { AxiosError } from 'axios'
import { Track } from '../../models/Track'
import { ServerException } from '../../models/ServerException'
import { useUploadTrackMutation } from '../../storage/ApiSlice/TracksApi'

interface AudioBlob extends Blob {
  duration: number
}

interface UploadTrackFormProps {
  onClose: () => void
  fetchAlbum: () => void
  defaultAlbumOption: string
}

const UploadTrackForm:FC<UploadTrackFormProps> = ({onClose, fetchAlbum, defaultAlbumOption}) => {
    const user = useAppSelector(state => state.user)
    const toast = useToast()
    const [uploadTrack] = useUploadTrackMutation()

    const handleTrackUpload = async (formData: FormData, setErrors) => {
      await uploadTrack(formData)
      .then((res: {data: Track}) => {
        toast({
          title: 'Track uploaded.',
          description: `Now you can listen "${res.data.name}"!`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
        fetchAlbum()
        onClose()
      })
      .catch((err: AxiosError<ServerException>) => {
        setErrors({
          audio: err.response.data.type === "audio" ? err.response.data.message : ""
        })
      })
    }

    const UploadTrackSchema = yup.object().shape({
        name: yup.string()
          .min(3, 'Too Short')
          .max(50, 'Too Long')
          .required('Required'),
        text: yup.string()
            .max(300, "Too long"),
        album: yup.string()
        .required('Required')
        ,
      });

  return (
    <Formik
        initialValues={{
            name: "",
            text: "",
            album: "",
            photo: {} as File,
            audio: {} as AudioBlob
        }}
        validationSchema={UploadTrackSchema}
        onSubmit={async (values, actions) => {
            if (values.photo.size > 5000000) {
              actions.setFieldError("photo", "Photo is too big (max 5MB).")
              return
            }
            if (values.audio.size > 5000000) {
              actions.setFieldError("audio", "Audio is too big (max 5MB).")
              return
            }
            const compresedPhoto = values.photo.size && (await imageCompression(values.photo, {
              maxSizeMB: 0.5
            }))
            console.log(compresedPhoto)
            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("text", values.text)
            formData.append("originalAlbumId", values.album)
            formData.append("photo", compresedPhoto)
            formData.append("audio", values.audio)
            formData.append("duration", ""+values.audio.duration)
   
            await handleTrackUpload(formData, actions.setErrors)            
        }}
    >
        {({}) => (
            <Flex w="100%" p="30px">
              <Form style={{width: "100%", display: "flex", flexDirection: "column"}}>
                  <Flex w="100%" flexDir="column">
                    <Flex justifyContent="space-between">
                          <Flex w="100%">
                            <Box w="100%" mr="40px">
                              <InputField mb="10px" fieldName='name'/>
                              <SelectField fieldName='album' label='Album' defaultOption={defaultAlbumOption} options={user.info.albums.filter(album => album.id !== user.info.mainAlbum.id)}/>
                            </Box>
                            <FileField option={FileFieldOptions.photo} fieldName='photo'/>
                          </Flex>
                    </Flex>
                    <InputTextArea fieldName='text' placeholder='Song text (up to 300 characters)'/>
                    <FileField w="100%" h="100%" inputW="100%" inputH="min" mb="30px" option={FileFieldOptions.audio} fieldName='audio'/>
                  </Flex>
                <Flex justifyContent="flex-end" mt="10px">
                  <Button px="30px" type="submit">Upload</Button>
                  <Button px="30px" ml="15px" onClick={onClose}>Cancel</Button>
                </Flex>
              </Form>

            </Flex>
        )}
    </Formik>
  )
}

export default UploadTrackForm