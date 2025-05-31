import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Course() {
    return (
        <>
            <Header />
            <div className="bg-gradient-to-b from-cyan-100 to-white py-4">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Breadcrumb & Title */}
                    <div className="flex items-center gap-2 text-gray-700 text-lg mb-2">
                        <span className="text-2xl">&#9776;</span>
                        <a href='/courseList'><span className="uppercase tracking-widest text-sm">E-COURSES</span></a>
                        <span className="mx-1 text-cyan-400">•</span>
                        <span className="font-bold text-lg tracking-wide">THE TRUTH ABOUT DRUGS</span>
                    </div>
                    {/* Step Title */}
                    <div className="text-center mt-6 mb-2">
                        <div className="text-2xl text-gray-700 font-normal mb-2">
                            1. Watch the documentary chapter
                        </div>
                        <div className="text-cyan-700 italic text-3xl font-semibold mb-4">
                            The Truth About Drugs: Introduction
                        </div>
                        <hr className="border-t border-gray-300 mb-6" />
                    </div>
                    {/* Video */}
                    <div className="flex justify-center mb-8">
                        <div className="w-full max-w-2xl aspect-video bg-gray-200 flex items-center justify-center relative">
                            <video
                                controls
                                poster="https://www.drugfreeworld.org/dfw_assets/images/dfw/2019-redesign/courses/drugs-course.jpg"
                                className="w-full h-full object-cover"
                            >
                                <source src="https://www.drugfreeworld.org/course/video/intro.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            {/* Play button overlay for style, can be removed if using real video */}
                            {/* <button className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-white bg-opacity-80 rounded-full p-4 text-4xl text-gray-700">&#9654;</span>
                            </button> */}
                        </div>
                    </div>
                    {/* Continue Button */}
                    <div className="flex justify-center mt-8 mb-12">
                        <button
                            className="border-2 border-cyan-400 text-cyan-600 text-xl font-semibold px-16 py-3 rounded transition hover:bg-cyan-50 tracking-widest"
                        >
                            CONTINUE
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Course
