"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Blogbar from "@/components/Blog/Blogbar";
import BlogCard from "@/components/Blog/BlogCard";

export const blogPosts = [
  
  {id:12,
    title: "Career Growth in 2025",
    category: "Career",
    desc: "Discover the top  skills you need to stay ahead in the job market djfbsbj sdkjsdjk sjkdb ksdjg sjdkn jksnskills you need to stay ahead in the job market djfbsbj sdkjsdjk sjkdb ksdjg sjdkn jksn jksf jksdnf sdfjksdf jksdbfjk sdjkf sdjkfb hksdbf fksdbf fhjksdbkjf skjf bsekfbsjkfbsjdkfb sj jksfjk bsekj",
    author: "Jane Smith",
    image: "https://trainingindustry.com/content/uploads/2021/07/8.10.21_Content_Dev_1182967367-1920x1080.jpg",
    
    
  },
  {id:134,
    title: "Workplace Trends You Can't Ignore",
    category: "News",
    subtitle: "The future of hybrid work",
    desc: "From remote-first models to AI-powered productivity tools...",
    author: "Alex Johnson",
    image: "https://d2py10ayqu2jji.cloudfront.net/Career.webp",
    
    
  },
  {id:1343,
    title: "Workplace Trends You Can't Ignore",
    category: "News",
    subtitle: "The future of hybrid work",
    desc: "From remote-first models to AI-powered productivity tools...",
    author: "Alex Johnson",
    image: "https://d2py10ayqu2jji.cloudfront.net/Career.webp",
    
    
  },
  {id:12322,
    title: "Workplace Trends You Can't Ignore",
    category: "News",
    subtitle: "The future of hybrid work",
    desc: "From remote-first models to AI-powered productivity tools...",
    author: "Alex Johnson",
    image: "https://d2py10ayqu2jji.cloudfront.net/Career.webp",
    
    
  },
  {id:122222,
    title: "Workplace Trends You Can't Ignore",
    category: "News",
    subtitle: "The future of hybrid work",
    desc: "From remote-first models to AI-powered productivity tools...",
    author: "Alex Johnson",
    image: "https://d2py10ayqu2jji.cloudfront.net/Career.webp",
    
  
  },
  {id:1111,
    title: "Workplace Trends You Can't Ignore",
    category: "News",
    subtitle: "The future of hybrid work",
    desc: "From remote-first models to AI-powered productivity tools...",
    author: "Alex Johnson",
    image: "https://d2py10ayqu2jji.cloudfront.net/Career.webp",
    
    
  },
  {
    id:1777,
    title: "Workplace Trends You Can't Ignore",
    category: "News",
    subtitle: "The future of hybrid work",
    desc: "From remote-first models to AI-powered productivity tools...",
    author: "Alex Johnson",
    image: "https://d2py10ayqu2jji.cloudfront.net/Career.webp",
  
  },
];

const Page = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Filtering logic
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      [post.title, post.category, post.author]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter = filter === "All" || post.category === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        className="bg-gray-900 text-white py-40 px-4 sm:px-6 lg:px-8 rounded-b-[40px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-16 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Blogs
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl max-w-3xl opacity-80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover insights, trends, and ideas with the Bytewave Blog — your
            source for growth and inspiration.
          </motion.p>
        </div>
      </motion.div>

      {/* Blogbar (Search + Filter) */}
      <Blogbar onSearch={setSearch} onFilter={setFilter} />

      {/* Blog Cards */}
      <br />
      <br />
      <br />
      <div className="p-6 space-y-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <BlogCard key={index} data={post} reverse={index % 2 !== 0} />
          ))
        ) : (
          <p className="text-center text-gray-600 mt-10">No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
