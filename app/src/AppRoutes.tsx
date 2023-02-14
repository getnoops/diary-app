import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import reactLogo from "./assets/react.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateEntryMutation, useGetEntriesQuery } from "./static/queries";
import { useQueryClient } from "@tanstack/react-query";
import { PencilIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, LayoutGroup, motion, Variants } from "framer-motion";
import classNames from "classnames";
import Pencil from "./components/Pencil";
import WriteText from "./components/WriteText";

interface FormInputs {
  text: string;
}

interface Entry {
  text: string;
  dateTime: string;
  ts: string;
}

const schema = yup
  .object({
    text: yup.string().required("required").max(300, "max 300 characters"),
  })
  .required();

// https://stackoverflow.com/questions/783899/how-can-i-count-text-lines-inside-an-dom-element-can-i

function App() {
  const [text, setText] = useState("");

  const { data: entriesData } = useGetEntriesQuery();
  const { mutateAsync } = useCreateEntryMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setText(data.text);
    reset();

    await mutateAsync({ text: data.text });
  };

  return (
    <div className=" bg-slate-50 pt-24 pb-8">
      <div className="mx-auto w-full max-w-6xl px-4 text-slate-700">
        <div className="my-2 flex items-end justify-between">
          <h1 className="text-2xl font-medium">Dear Diary...</h1>
          <h2 className="text-lg  tracking-wide text-slate-700">
            {new Date().toLocaleDateString()}
          </h2>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea
              {...register("text")}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink= 'http://www.w3.org/1999/xlink' height='28' width='20' stroke='%23d9f0ff' stroke-width='2' %3E%3Cline x1='0' y1='7' x2='20' y2='7' /%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                backgroundAttachment: "local",
              }}
              rows={6}
              className="relative block w-full rounded-md border-gray-300 bg-white leading-7 shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
            <p className="text-sm font-medium text-red-700">
              {errors.text?.message}
            </p>

            <div className="my-2 flex flex-row-reverse justify-between">
              <button
                className="inline-flex items-center gap-x-2 rounded-md bg-amber-500 px-3 py-1 font-medium text-white transition hover:bg-amber-600 hover:text-slate-100"
                type="submit"
              >
                <div className="h-6 w-6 rounded border-2 border-white">
                  {text === "" && (
                    <motion.div
                      className="pointer-events-none"
                      animate={{
                        top: 0,
                      }}
                      style={{
                        transformOrigin: "bottom left",
                      }}
                      layoutId="pencil"
                    >
                      <Pencil className="h-5 w-5 text-white " />
                    </motion.div>
                  )}
                </div>
                Write
              </button>
            </div>
          </form>
        </div>

        {/* This div is needed so we can measure how many lines the text takes up */}
        <div className="relative -z-10  w-full">
          <div className="absolute w-fit max-w-full">
            <span
              id="example_text"
              className="m-4 block break-words bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text leading-7 text-transparent"
            ></span>
          </div>
        </div>

        {!(text === "") && (
          <div
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' height='28' width='20' stroke='%23d9f0ff' stroke-width='2' %3E%3Cline x1='0' x2='20' y1='11' y2='11' /%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundAttachment: "local",
            }}
            className="my-4 rounded-md bg-white p-4 shadow-md"
          >
            <div className="flex justify-between">
              <h1 className="text-lg font-medium">Dear Diary...</h1>
              <h1 className="">{new Date().toLocaleDateString()}</h1>
            </div>
            <WriteText text={text} setText={setText} />
          </div>
        )}

        <div className="space-y-4">
          <h1 className="text-xl font-medium">Pages</h1>
          <div className="grid grid-cols-3 gap-4">
            <AnimatePresence>
              {entriesData &&
                entriesData.map((entry: Entry, i: number) => (
                  <motion.div
                    key={entry.ts}
                    layoutId={"page_" + entry.ts}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5 },
                    }}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' height='28' width='20' stroke='%23d9f0ff' stroke-width='2' %3E%3Cline x1='0' x2='20' y1='11' y2='11' /%3E%3C/svg%3E")`,
                      backgroundRepeat: "repeat",
                      backgroundAttachment: "local",
                    }}
                    className="relative space-y-2 overflow-hidden rounded-md border border-slate-200 bg-white p-4 shadow-md"
                  >
                    <div className="relative">
                      <div className="flex items-end justify-between">
                        <p className="font-medium">Dear Diary...</p>
                        <p className="text-sm text-slate-600">
                          {new Date(entry.dateTime).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="pt-7 leading-7">{entry.text}</p>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
