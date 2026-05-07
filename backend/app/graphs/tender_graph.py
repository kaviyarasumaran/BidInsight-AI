from __future__ import annotations

from langgraph.graph import END, StateGraph

from app.nodes.criteria_node import criteria_extraction_node
from app.nodes.confidence_node import confidence_node
from app.nodes.human_review_node import human_review_check_node
from app.nodes.context_node import context_builder_node
from app.nodes.ocr_node import ocr_node
from app.nodes.parser_node import parser_node
from app.nodes.summary_node import summary_node
from app.nodes.types import TenderState


def build_tender_graph():
    g = StateGraph(TenderState)
    g.add_node("ocr", ocr_node)
    g.add_node("parser", parser_node)
    g.add_node("criteria_extract", criteria_extraction_node)
    g.add_node("context_builder", context_builder_node)
    g.add_node("confidence", confidence_node)
    g.add_node("review_check", human_review_check_node)
    g.add_node("summary", summary_node)

    g.set_entry_point("ocr")
    g.add_edge("ocr", "parser")
    g.add_edge("parser", "criteria_extract")
    g.add_edge("criteria_extract", "context_builder")
    g.add_edge("context_builder", "confidence")
    g.add_edge("confidence", "review_check")
    g.add_edge("review_check", "summary")
    g.add_edge("summary", END)
    return g.compile()
