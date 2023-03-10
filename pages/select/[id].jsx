import { useState, useEffect } from "react";
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import supabase from "../../supabase";
import Link from "next/link";

const { DateTime } = require("luxon");

const Select = () => {
  // state to store data
  const [getUser, setUser] = useState();
  const [getName, setName] = useState('');
  const queryClient = useQueryClient();

    const router = useRouter();
    const { id } = router.query;
    console.log(id);
  // query to get data
  const fetchData = async () =>
    await supabase.rpc("get_user_data", { _uuid: id.toString() });
  // const fetchUser = async () => await supabase.auth.user();
  const { data, isFetching } = useQuery("selectFetch", fetchData);
  // const { userData, isLoading } = useQuery("selectUser", fetchUser);

  if (data) {
    console.log(data)
    console.log(getUser)
  }

  // if (userData) {
  //   console.log(userData)
  // }

  // get data
  // useEffect(() => {
  //   getList();
  // }, []);
  useEffect(() => {
    // if (localStorage.getItem("user") !== null ) {
      //checking if there already is a state in localstorage
      //if yes, update the current state with the stored one
      setUser(localStorage.getItem("user"));
      setName(localStorage.getItem("name").toString());
    // }
  }, []);

  

  // if (getUser) {
  //   console.log(getUser)
  // }
  // handle delete
  const handleDelete = async (id) => {
    const { data, error } = await supabase
      .from("trainings_2")
      .delete()
      .eq("id", id);
    if (error) {
      console.log(error);
    }

    queryClient.invalidateQueries("selectFetch");
    queryClient.invalidateQueries("updateFetch");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-20" id="select">
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <h4>User name: {getName}</h4> <br />
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Title
                </th>
                <th scope="col" className="py-3 px-6">
                  Content
                </th>
                <th scope="col" className="py-3 px-6">
                  Start Date
                </th>
                <th scope="col" className="py-3 px-6">
                  End Date
                </th>
                <th scope="col" className="py-3 px-6">
                  <span className="sr-only">Edit</span>
                </th>
                <th scope="col" className="py-3 px-6">
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.data.map((item) => {
                  return (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      key={item.id}
                    >
                      <th
                        scope="row"
                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.title}
                      </th>
                      <td className="py-4 px-6">{item.content}</td>
                      <td className="py-4 px-6">
                        {DateTime.fromISO(item.start_date_time).toFormat(
                          "EEEE',' MMMM d',' h:mm a"
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {DateTime.fromISO(item.end_date_time).toFormat(
                          "EEEE',' MMMM d',' h:mm a"
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={{
                            pathname: "/update",
                            query: { training: item.id },
                          }}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Select;
