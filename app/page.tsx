"use client";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  ScrollShadow,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { cn } from "@nextui-org/theme";
import React, { useEffect, useState } from "react";

import { title } from "@/components/primitives";

export default function Home() {
  // File list, selected file, chapters, current chapter index, edit content
  const [fileList, setFileList] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [chapters, setChapters] = useState<
    { title: string; subtitle?: string; content: string }[]
  >([]);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [editContent, setEditContent] = useState("");

  // Fetch file list
  useEffect(() => {
    fetch("/api/txt-files")
      .then((res) => res.json())
      .then((data) => setFileList(data));
  }, []);

  // When a file is selected, fetch its content and auto split chapters
  useEffect(() => {
    if (!selectedFile) return;
    setChapters([]);
    setCurrentChapterIdx(0);
    setEditContent("");
    fetch(`/api/txt-files/${selectedFile}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) return;
        return fetch("/api/auto-split", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: data.content }),
        });
      })
      .then((res) => (res ? res.json() : null))
      .then((data) => {
        if (data && data.chapters) {
          setChapters(data.chapters);
          setCurrentChapterIdx(0);
          setEditContent(data.chapters[0]?.content || "");
        }
      });
  }, [selectedFile]);

  // Update edit content when switching chapters
  useEffect(() => {
    if (
      chapters.length > 0 &&
      currentChapterIdx >= 0 &&
      currentChapterIdx < chapters.length
    ) {
      setEditContent(chapters[currentChapterIdx].content);
    }
  }, [currentChapterIdx, chapters]);

  // Update edit content in real time
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value);
    // Only update the current chapter content, others remain unchanged
    setChapters((prev) =>
      prev.map((ch, idx) =>
        idx === currentChapterIdx ? { ...ch, content: e.target.value } : ch
      )
    );
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Place your changes here</span>
      </div>
      <div className="mt-8 gap-16">
        <Snippet hideCopyButton hideSymbol className="gap-4" variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
          <span>Please feel free to use the example components below.</span>
        </Snippet>
      </div>
      <div className="pt-6 w-64">
        <Select
          items={fileList.map((f) => ({ key: f, label: f }))}
          label="Import txt"
          placeholder="Select a novel txt file"
          selectedKeys={selectedFile ? [selectedFile] : []}
          onSelectionChange={(keys) => {
            const arr = Array.from(keys);
            setSelectedFile(arr[0] as string);
          }}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </div>

      <div className="pt-6">
        <div className="flex flex-row ">
          <div
            className={cn(
              "relative flex h-full w-96 max-w-[384px] flex-1 flex-col !border-r-small border-divider pr-6 transition-[transform,opacity,margin] duration-250 ease-in-out"
            )}
            id="menu"
          >
            <header className="flex items-center text-md font-medium text-default-500 group-data-[selected=true]:text-foreground">
              <Icon
                className="text-default-500 mr-2"
                icon="solar:clipboard-text-outline"
                width={24}
              />
              Chapters
            </header>
            <ScrollShadow
              className="max-h-[calc(500px)] -mr-4"
              id="menu-scroll"
            >
              <div className="flex flex-col gap-4 py-3 pr-4">
                {chapters.map((ch, idx) => (
                  <Card
                    key={idx}
                    isPressable
                    className={`max-w-[384px] border-1 border-divider/15 ${
                      idx === currentChapterIdx ? "bg-themeBlue/20" : ""
                    }`}
                    shadow="none"
                    onClick={() => setCurrentChapterIdx(idx)}
                  >
                    <CardHeader className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {idx === currentChapterIdx && (
                          <Chip
                            className="mr-1 text-themeBlue bg-themeBlue/20"
                            radius="sm"
                            size="sm"
                            variant="flat"
                          >
                            Editing
                          </Chip>
                        )}
                        <p className="text-left mr-1">
                          {ch.title}
                          {ch.subtitle ? ` - ${ch.subtitle}` : ""}
                        </p>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <p className="line-clamp-2">
                        {ch.content.slice(0, 80)}
                        {ch.content.length > 80 ? "..." : ""}
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </ScrollShadow>
          </div>

          <div className="w-full flex-1 flex-col min-w-[600px] pl-4">
            <div className="flex flex-col">
              <header className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <Button isIconOnly size="sm" variant="light">
                    <Icon
                      className="hideTooltip text-default-500"
                      height={24}
                      icon="solar:sidebar-minimalistic-outline"
                      width={24}
                    />
                  </Button>
                  <h4 className="text-md">
                    {chapters[currentChapterIdx]?.title}
                    {chapters[currentChapterIdx]?.subtitle
                      ? ` - ${chapters[currentChapterIdx]?.subtitle}`
                      : ""}
                  </h4>
                </div>
              </header>
              <div className="w-full flex-1 flex-col min-w-[400px]">
                <div className={cn("flex flex-col gap-4")}>
                  <div className="flex flex-col items-start">
                    <div className="relative mb-5 w-full h-[400px] bg-slate-50 dark:bg-gray-800 rounded-lg">
                      <div className="absolute inset-x-4 top-4 z-10 flex justify-between items-center">
                        <div className="flex justify-between">
                          <Button
                            className="mr-2 bg-white dark:bg-gray-700"
                            size="sm"
                            startContent={
                              <Icon
                                className="text-default-500"
                                icon="ant-design:highlight-outlined"
                                width={24}
                              />
                            }
                            variant="flat"
                          >
                            button-1
                          </Button>
                        </div>

                        <Button
                          className="mr-2 bg-white dark:bg-gray-700"
                          size="sm"
                          startContent={
                            <Icon
                              className="text-default-500"
                              icon="material-symbols:save-outline"
                              width={24}
                            />
                          }
                          variant="flat"
                        >
                          button-2
                        </Button>
                      </div>
                      <div>
                        <ScrollShadow className="editScrollShow absolute left-2 right-2 bottom-10 top-12 text-base p-3 resize-none rounded-md border-solid border-inherit bg-slate-50 dark:bg-gray-800">
                          <div className="flex w-full h-full bg-slate-50 dark:bg-gray-200 rounded-lg p-2">
                            {/* Adjusted to use flex display for layout */}
                            <textarea
                              className="flex-1 p-3 resize-none rounded-md border border-transparent bg-slate-50 dark:bg-gray-200 text-gray-900"
                              value={editContent}
                              onChange={handleContentChange}
                              style={{ minHeight: 320, maxHeight: 360 }}
                            />
                            <div className="bg-gray-100 p-1 rounded-md self-end ml-2">
                              {/* Added margin-left to separate from textarea, align-self to position at the bottom */}
                            </div>
                          </div>
                        </ScrollShadow>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
