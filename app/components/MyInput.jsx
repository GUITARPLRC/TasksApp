import React from "react"
import { colors } from "app/theme"
import { View, TextInput } from "react-native"
import { useCreateTaskMutation } from "../api"
import { useDatabase } from "@nozbe/watermelondb/react"
import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider"
import { Button } from "./Button"

const Input = () => {
  const [title, setTitle] = React.useState("")
  const [createTask, { isLoading: isCreateLoading }] = useCreateTaskMutation()
  const database = useDatabase()

  const addTask = async () => {
    await database.write(async () => {
      await database.collections.get("tasks").create((task) => {
        task.title = title
        task.checked = false
      })
      setTitle("")
    })
  }

  // const addApiTask = async () => {
  //   try {
  //     const newTask = {
  //       _id: Date.now(),
  //       title,
  //     }
  //     await createTask(newTask).unwrap()
  //     addTask(newTask)
  //     setTitle("")
  //   } catch (e) {
  //     console.log("💻 create error", e)
  //   }
  // }

  return (
    <View>
      <View style={$container}>
        <TextInput
          label="Title"
          placeholder="Enter title"
          placeholderTextColor={colors.palette.neutral500}
          onChangeText={(text) => setTitle(text)}
          value={title}
          style={$input}
        />
        <Button style={$item} onPress={addTask} text="Add New Task" />
      </View>
    </View>
  )
}

export const MyInput = React.memo(withDatabase(Input))

const $container = {
  flexDirection: "row",
  height: 75,
}
const $item = {
  height: 50,
}
const $input = {
  borderWidth: 1,
  borderColor: colors.palette.neutral800,
  borderRadius: 10,
  color: colors.palette.neutral900,
  padding: 10,
  marginBottom: 10,
  width: 200,
  height: 50,
}
