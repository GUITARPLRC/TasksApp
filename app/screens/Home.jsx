import React, { useEffect } from "react"
import { View } from "react-native"
import { withObservables, useDatabase } from "@nozbe/watermelondb/react"
import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { Icon } from "../components/Icon"
import { colors } from "../theme"
import { useTasksQuery, useDeleteTaskMutation, useUpdateTaskMutation } from "../api"
import { MyInput } from "../components/MyInput"
import MyListItem from "../components/MyListItem"
import { reset } from "i18n-js"
import { ScrollView } from "react-native-gesture-handler"

// TODO: handle local state vs watermelon ids for all actions

// TODO: Check connection before syncing
// TODO: Loading states

const HomeScreen = ({ tasks = [] }) => {
  const { data, isLoading: isQueryLoading } = useTasksQuery()
  const [deleteTask, { isLoading: isDeleteLoading }] = useDeleteTaskMutation()
  const [updateTask, { isLoading: isUpdateLoading }] = useUpdateTaskMutation()
  const database = useDatabase()

  useEffect(() => {
    if (!isQueryLoading) {
      // syncWithApi()
    }
  }, [])

  console.log(tasks.length)
  console.log(
    tasks.map((task) => ({
      title: task.title,
      id: task.id,
      checked: task.checked,
    })),
  )

  const deleteDBTask = async (id) => {
    await database.write(async () => {
      await (await database.collections.get("tasks").find(id)).destroyPermanently()
    })
  }

  // const deleteApiTask = async ({ _id, id }) => {
  //   try {
  //     await deleteTask(_id).unwrap()
  //     deleteDBTask(id)
  //   } catch (e) {
  //     console.log("💻 delete error", e)
  //   }
  // }

  const resetDB = async () => {
    tasks.forEach((task) => {
      deleteDBTask(task.id)
    })
  }

  const completeDBTask = async (task) => {
    task.toggleChecked()
  }

  // const completeTask = async ({ _id, checked, syncNumber }) => {
  //   const apiId = data.find((task) => task._id === _id).id
  //   console.log({ apiId })
  //   try {
  //     const newTask = {
  //       _id,
  //       checked: !checked,
  //       syncNumber: syncNumber + 1,
  //     }
  //     await updateTask(apiId, newTask).unwrap()
  //     completeDBTask(newTask)
  //   } catch (e) {
  //     console.log("💻 update error", e)
  //   }
  // }

  const syncWithApi = async () => {
    // last write wins strategy

    // 1. compare the two
    const tasksToUpdate = []
    const tasksToDelete = []
    const tasksToCreate = []
    tasks.forEach((localTask) => {
      const apiTask = data.find((apiTask) => apiTask.id === localTask.id)
      if (apiTask) {
        // if syncNumber is greater, update local state task
        // if syncNumber is less, call and update api state task
        if (apiTask.syncNumber > localTask.syncNumber) {
          tasksToUpdate.push(apiTask)
        } else if (apiTask.syncNumber < localTask.syncNumber) {
          tasksToUpdate.push(localTask)
        }
      } else {
        tasksToDelete.push(localTask)
      }
    })
    data.forEach((apiTask) => {
      const localTask = tasks.find((localTask) => localTask.id === apiTask.id)
      if (!localTask) {
        tasksToCreate.push(apiTask)
      }
    })

    console.log("💻 tasksToUpdate", tasksToUpdate)
    console.log("💻 tasksToDelete", tasksToDelete)
    console.log("💻 tasksToCreate", tasksToCreate)

    // // 2. if api task is newer, update local task
    // for (const task of tasksToUpdate) {
    //   await database.write(async () => {
    //     await database.collections
    //       .get("tasks")
    //       .find(task.id)
    //       .update((t) => {
    //         t.title = task.title
    //         t.checked = task.checked
    //         t.syncNumber = task.syncNumber
    //       })
    //   })
    // }
    // // 3. if local task is newer, update api task
    // for (const task of tasksToUpdate) {
    //   await updateTask(task.id, { checked: task.checked, syncNumber: task.syncNumber }).unwrap()
    // }
    // // 4. if task is deleted locally, delete from api
    // for (const task of tasksToDelete) {
    //   await deleteTask(task.id).unwrap()
    // }
  }

  return (
    <View style={$container}>
      <MyInput />
      <Button
        style={$item}
        onPress={syncWithApi}
        text="Sync"
        LeftAccessory={() => <Icon icon="settings" style={$icon} />}
      />
      <ScrollView>
        {tasks?.map((task) => (
          <Card
            key={task.id}
            style={$item}
            verticalAlignment="force-footer-bottom"
            content={`Title: ${task.title || ""}`}
            contentStyle={task.checked ? $complete : {}}
            FooterComponent={
              <MyListItem task={task} completeTask={completeDBTask} deleteApiTask={deleteDBTask} />
            }
          />
        ))}
      </ScrollView>
    </View>
  )
}

const enhanceQueries = withObservables([], ({ database }) => {
  return {
    tasks: database.collections.get("tasks").query().observe(),
  }
})
export const Home = withDatabase(enhanceQueries(HomeScreen))

const $container = {
  flex: 1,
  backgroundColor: colors.background,
  marginTop: 60,
  padding: 20,
}
const $icon = {
  marginRight: 10,
  width: 30,
}
const $item = {
  marginBottom: 20,
}
const $complete = {
  textDecorationLine: "line-through",
}
